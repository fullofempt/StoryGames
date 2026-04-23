<template>
  <div class="vn-player" :style="backgroundStyle" @click="handleAdvance">
    <div class="vn-overlay"></div>

    <transition-group name="sprite" tag="div" class="vn-stage">
      <div
        v-for="character in visibleCharacters"
        :key="character.id"
        class="vn-character"
        :class="[
          `slot-${character.slot || 'center'}`,
          { active: currentDialogue?.speaker === character.id }
        ]"
      >
        <img
          class="vn-sprite"
          :src="resolveSprite(character.id, character.emotion)"
          :alt="getCharacterName(character.id)"
          @error="handleSpriteError"
        />
      </div>
    </transition-group>

    <transition name="fade">
      <div v-if="transitionState.visible" class="vn-transition">
        <div class="vn-transition-label">{{ transitionLabel }}</div>
      </div>
    </transition>

    <div class="vn-homebar" @click.stop>
      <a class="vn-nav-button home" href="/">← На главную</a>
    </div>

    <div class="vn-topbar">
      <div>
        <div class="vn-episode">{{ currentEpisode?.title }}</div>
        <div class="vn-scene">{{ currentScene?.title }}</div>
      </div>
      <div class="vn-progress">
        Сцена {{ currentSceneIndex + 1 }} / {{ scenes.length }}
      </div>
    </div>

    <div class="vn-bottom">
      <div v-if="currentDialogue" class="vn-dialogue-box" @click.stop>
        <div class="vn-speaker">
          {{ getCharacterName(currentDialogue.speaker) }}
        </div>
        <div class="vn-text">{{ currentDialogue.text }}</div>

        <div class="vn-dialogue-actions">
          <button
            class="vn-button secondary"
            type="button"
            :disabled="!canGoBack"
            @click="goBack"
          >
            ← Назад
          </button>

          <div class="vn-hint">Клик по экрану или кнопка “Вперёд”</div>

          <button
            class="vn-button"
            type="button"
            :disabled="transitionState.visible"
            @click="goForward"
          >
            Вперёд →
          </button>
        </div>
      </div>

      <div v-else-if="currentSystemText" class="vn-dialogue-box system" @click.stop>
        <div class="vn-speaker">Система</div>
        <div class="vn-text">{{ currentSystemText }}</div>

        <div class="vn-dialogue-actions">
          <button
            class="vn-button secondary"
            type="button"
            :disabled="!canGoBack"
            @click="goBack"
          >
            ← Назад
          </button>

          <div class="vn-hint">Клик по экрану или кнопка “Вперёд”</div>

          <button
            class="vn-button"
            type="button"
            :disabled="transitionState.visible"
            @click="goForward"
          >
            Вперёд →
          </button>
        </div>
      </div>

      <div v-else class="vn-controls" @click.stop>
        <button class="vn-button" type="button" @click="startStory">
          {{ hasStarted ? 'Начать заново' : 'Начать эпизод' }}
        </button>

        <button
          class="vn-button secondary"
          type="button"
          :disabled="!canGoBack"
          @click="goBack"
        >
          ← Назад
        </button>

        <button class="vn-button secondary" type="button" @click="goForward">
          {{ isFinished ? 'Перезапустить' : 'Вперёд →' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'

const props = defineProps({
  story: {
    type: Object,
    required: true
  },
  episodeId: {
    type: String,
    default: 'episode0'
  },
  assetsBase: {
    type: String,
    default: '/images/novel'
  },
  autoStart: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['step-change', 'scene-change', 'finished'])

const currentEpisode = computed(() => {
  return (
    props.story.episodes?.find((episode) => episode.id === props.episodeId) ||
    props.story.episodes?.[0] ||
    null
  )
})

const scenes = computed(() => currentEpisode.value?.scenes || [])
const charactersMap = computed(() => props.story.characters || {})
const assetsMap = computed(() => props.story.assets || {})

const currentSceneIndex = ref(0)
const currentStepIndex = ref(-1)
const hasStarted = ref(false)
const isFinished = ref(false)
const currentReadableIndex = ref(-1)

const stageState = reactive({
  backgroundKey: '',
  visibleCharacters: []
})

const currentDialogue = ref(null)
const currentSystemText = ref('')
const transitionState = reactive({
  visible: false,
  name: ''
})

const currentScene = computed(() => scenes.value[currentSceneIndex.value] || null)
const visibleCharacters = computed(() => stageState.visibleCharacters.filter((item) => !item.hidden))

const readableSteps = computed(() => {
  const list = []

  scenes.value.forEach((scene, sceneIndex) => {
    ;(scene.steps || []).forEach((step, stepIndex) => {
      if (step?.type === 'say' || step?.type === 'system') {
        list.push({ sceneIndex, stepIndex })
      }
    })
  })

  return list
})

const canGoBack = computed(() => currentReadableIndex.value > 0)

const transitionLabel = computed(() => {
  if (transitionState.name === 'fadeIn') return 'Плавное появление'
  if (transitionState.name === 'fadeOut') return 'Плавное затемнение'
  return 'Переход'
})

const backgroundStyle = computed(() => {
  const bgPath = resolveBackground(stageState.backgroundKey)

  return {
    backgroundImage: bgPath
      ? `linear-gradient(rgba(8, 10, 18, 0.25), rgba(8, 10, 18, 0.55)), url("${bgPath}")`
      : 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
    backgroundPosition: 'center',
    backgroundSize: 'cover'
  }
})

function resolveBackground(backgroundKey) {
  if (!backgroundKey) return ''

  const assetEntry =
    assetsMap.value.backgrounds?.[backgroundKey] ||
    assetsMap.value.background?.[backgroundKey]

  if (typeof assetEntry === 'string') return normalizeAssetPath(assetEntry)
  if (assetEntry?.src) return normalizeAssetPath(assetEntry.src)

  return `${props.assetsBase}/backgrounds/${backgroundKey}.png`
}

function resolveSprite(characterId, emotion = 'neutral') {
  const character = charactersMap.value[characterId]
  const emotionEntry = character?.emotions?.[emotion]

  if (typeof emotionEntry === 'string') return normalizeAssetPath(emotionEntry)
  if (emotionEntry?.src) return normalizeAssetPath(emotionEntry.src)

  return `${props.assetsBase}/characters/${characterId}/${emotion}.png`
}

function normalizeAssetPath(path) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (path.startsWith('/')) return path
  return `/${path}`
}

function getCharacterName(characterId) {
  return charactersMap.value[characterId]?.name || characterId
}

function applyInitialSceneState(scene) {
  stageState.backgroundKey = scene?.initialState?.background || ''
  stageState.visibleCharacters = (scene?.initialState?.visibleCharacters || []).map((character) => ({
    id: character.id,
    slot: character.slot || 'center',
    emotion: character.emotion || 'neutral',
    hidden: false
  }))
}

function resetPlayerState() {
  currentSceneIndex.value = 0
  currentStepIndex.value = -1
  isFinished.value = false
  transitionState.visible = false
  transitionState.name = ''
  currentDialogue.value = null
  currentSystemText.value = ''
  applyInitialSceneState(scenes.value[0] || null)
}

function setCharacterState(target) {
  const existing = stageState.visibleCharacters.find((character) => character.id === target.id)

  if (existing) {
    existing.slot = target.slot ?? existing.slot
    existing.emotion = target.emotion ?? existing.emotion
    existing.hidden = false
    return
  }

  stageState.visibleCharacters.push({
    id: target.id,
    slot: target.slot || 'center',
    emotion: target.emotion || 'neutral',
    hidden: false
  })
}

function removeCharacter(id) {
  const index = stageState.visibleCharacters.findIndex((character) => character.id === id)
  if (index !== -1) {
    stageState.visibleCharacters.splice(index, 1)
  }
}

function processStep(step, { silent = false } = {}) {
  currentDialogue.value = null
  currentSystemText.value = ''

  if (!step) return

  switch (step.type) {
    case 'say': {
      if (charactersMap.value[step.speaker]) {
        setCharacterState({
          id: step.speaker,
          emotion: step.emotion || 'neutral'
        })
      }

      currentDialogue.value = {
        speaker: step.speaker,
        text: step.text,
        emotion: step.emotion || 'neutral'
      }
      break
    }

    case 'system': {
      currentSystemText.value = step.text || ''
      break
    }

    case 'transition': {
      transitionState.name = step.name || 'fade'

      if (!silent) {
        transitionState.visible = true
        window.setTimeout(() => {
          transitionState.visible = false
        }, step.duration || 450)
      } else {
        transitionState.visible = false
      }
      break
    }

    case 'background': {
      stageState.backgroundKey = step.background || ''
      break
    }

    case 'enter': {
      setCharacterState({
        id: step.target || step.character,
        slot: step.slot || 'center',
        emotion: step.emotion || 'neutral'
      })
      break
    }

    case 'exit': {
      removeCharacter(step.target || step.character)
      break
    }

    case 'emotion': {
      setCharacterState({
        id: step.target || step.character,
        emotion: step.emotion || 'neutral'
      })
      break
    }

    default:
      break
  }

  emit('step-change', {
    sceneIndex: currentSceneIndex.value,
    stepIndex: currentStepIndex.value,
    scene: currentScene.value,
    step
  })
}

function runUntilReadable(sceneIndexTarget, stepIndexTarget) {
  resetPlayerState()

  for (let sceneIndex = 0; sceneIndex <= sceneIndexTarget; sceneIndex += 1) {
    const scene = scenes.value[sceneIndex]
    currentSceneIndex.value = sceneIndex
    currentStepIndex.value = -1
    applyInitialSceneState(scene)

    emit('scene-change', {
      sceneIndex: currentSceneIndex.value,
      scene: currentScene.value
    })

    const lastStep = sceneIndex === sceneIndexTarget
      ? stepIndexTarget
      : (scene.steps?.length || 0) - 1

    for (let stepIndex = 0; stepIndex <= lastStep; stepIndex += 1) {
      currentStepIndex.value = stepIndex
      processStep(scene.steps[stepIndex], { silent: true })
    }
  }
}

function goToReadableIndex(index) {
  if (index < 0 || index >= readableSteps.value.length) return

  hasStarted.value = true
  isFinished.value = false
  currentReadableIndex.value = index

  const target = readableSteps.value[index]
  runUntilReadable(target.sceneIndex, target.stepIndex)
}

function moveToNextScene() {
  const nextSceneIndex = currentSceneIndex.value + 1

  if (nextSceneIndex >= scenes.value.length) {
    isFinished.value = true
    currentDialogue.value = null
    currentSystemText.value = 'Эпизод завершён.'
    emit('finished')
    return
  }

  currentSceneIndex.value = nextSceneIndex
  currentStepIndex.value = -1
  applyInitialSceneState(currentScene.value)

  emit('scene-change', {
    sceneIndex: currentSceneIndex.value,
    scene: currentScene.value
  })

  advanceToNextReadableStep()
}

function advanceToNextReadableStep() {
  if (isFinished.value) {
    startStory()
    return
  }

  while (true) {
    const nextStepIndex = currentStepIndex.value + 1
    const steps = currentScene.value?.steps || []

    if (nextStepIndex >= steps.length) {
      moveToNextScene()
      return
    }

    currentStepIndex.value = nextStepIndex
    const step = steps[currentStepIndex.value]
    processStep(step)

    if (step && ['say', 'system'].includes(step.type)) {
      const foundIndex = readableSteps.value.findIndex(
        (item) =>
          item.sceneIndex === currentSceneIndex.value &&
          item.stepIndex === currentStepIndex.value
      )

      currentReadableIndex.value = foundIndex
      return
    }
  }
}

function startStory() {
  hasStarted.value = true
  currentReadableIndex.value = -1
  resetPlayerState()

  emit('scene-change', {
    sceneIndex: currentSceneIndex.value,
    scene: currentScene.value
  })

  advanceToNextReadableStep()
}

function handleAdvance() {
  if (!hasStarted.value) {
    startStory()
    return
  }

  if (transitionState.visible) return
  goForward()
}

function goForward() {
  if (transitionState.visible) return

  if (isFinished.value) {
    startStory()
    return
  }

  advanceToNextReadableStep()
}

function goBack() {
  if (!canGoBack.value) return
  if (transitionState.visible) return

  goToReadableIndex(currentReadableIndex.value - 1)
}

function handleSpriteError(event) {
  event.target.style.opacity = '0.25'
  event.target.title = 'Спрайт не найден'
}

onMounted(() => {
  if (props.autoStart && scenes.value.length > 0) {
    startStory()
  }
})
</script>

<style scoped>
.vn-player {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  color: #f8fafc;
  font-family: Inter, system-ui, sans-serif;
}

.vn-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 0%, rgba(2, 6, 23, 0.12) 45%, rgba(2, 6, 23, 0.5) 100%);
}

.vn-stage {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: end;
  justify-content: center;
  pointer-events: none;
}

.vn-character {
  position: absolute;
  bottom: 180px;
  width: 220px;
  height: 520px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  transition: transform 0.25s ease, opacity 0.25s ease, filter 0.25s ease;
  opacity: 0.72;
  filter: saturate(0.8);
}

.vn-character.active {
  opacity: 1;
  filter: saturate(1);
}

.vn-character.active .vn-sprite {
  transform: translateY(-6px) scale(1.02);
}

.vn-sprite {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: bottom center;
}

.slot-far-left { left: 2%; }
.slot-left { left: 12%; }
.slot-center { left: 50%; transform: translateX(-50%); }
.slot-right { right: 12%; }
.slot-far-right { right: 2%; }

.vn-homebar {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 5;
}

.vn-topbar {
  position: relative;
  z-index: 3;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 24px;
  padding-left: 170px;
}

.vn-episode {
  font-size: 14px;
  opacity: 0.8;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.vn-scene {
  font-size: 28px;
  font-weight: 700;
}

.vn-progress {
  align-self: start;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  backdrop-filter: blur(8px);
  background: rgba(15, 23, 42, 0.45);
}

.vn-bottom {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  z-index: 3;
  padding: 24px;
}

.vn-dialogue-box,
.vn-controls {
  max-width: 1080px;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 24px;
  padding: 22px 24px;
  background: rgba(15, 23, 42, 0.82);
  backdrop-filter: blur(16px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.28);
}

.vn-dialogue-box.system {
  text-align: center;
}

.vn-speaker {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #93c5fd;
}

.vn-text {
  font-size: 24px;
  line-height: 1.5;
}

.vn-hint {
  margin-top: 14px;
  font-size: 13px;
  opacity: 0.68;
  text-align: center;
}

.vn-dialogue-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: 18px;
}

.vn-controls {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.vn-button,
.vn-nav-button {
  border: 0;
  border-radius: 16px;
  padding: 14px 18px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: 0.2s ease;
}

.vn-button {
  color: #0f172a;
  background: #f8fafc;
}

.vn-button:hover,
.vn-nav-button:hover {
  transform: translateY(-1px);
}

.vn-button.secondary,
.vn-nav-button.home {
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.vn-button.secondary:hover,
.vn-nav-button.home:hover {
  background: rgba(255, 255, 255, 0.16);
}

.vn-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}

.vn-transition {
  position: absolute;
  inset: 0;
  z-index: 4;
  display: grid;
  place-items: center;
  background: rgba(2, 6, 23, 0.72);
  backdrop-filter: blur(4px);
}

.vn-transition-label {
  padding: 12px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.fade-enter-active,
.fade-leave-active,
.sprite-enter-active,
.sprite-leave-active {
  transition: all 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.sprite-enter-from,
.sprite-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 900px) {
  .vn-character {
    width: min(20vw, 180px);
    bottom: 220px;
  }

  .vn-scene {
    font-size: 22px;
  }

  .vn-text {
    font-size: 18px;
  }

  .vn-controls,
  .vn-dialogue-actions {
    flex-direction: column;
  }

  .vn-topbar {
    padding-left: 24px;
    padding-top: 84px;
    flex-direction: column;
  }

  .vn-homebar {
    top: 16px;
    left: 16px;
  }
}
</style>