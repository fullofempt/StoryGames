<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";

const props = defineProps({
  story: {
    type: Object,
    required: true,
  },

  episodeId: {
    type: String,
    default: "episode0",
  },

  assetsBase: {
    type: String,
    default: "/images/novel",
  },

  autoStart: {
    type: Boolean,
    default: true,
  },
});


const episode = computed(() =>
  props.story.episodes?.find(
    (e: any) => e.id === props.episodeId
  ) || props.story.episodes?.[0]
);


const scenes = computed(() =>
  episode.value?.scenes || []
);


const characters = computed(() =>
  props.story.characters || {}
);


const assets = computed(() =>
  props.story.assets || {}
);



const sceneIndex = ref(0);
const stepIndex = ref(-1);
const started = ref(false);
const dialogue = ref<any>(null);
const systemText = ref("");
const transition = ref(false);



const stage = reactive({

  background: "",

  characters: [] as any[]

});



const currentScene = computed(() =>
  scenes.value[sceneIndex.value]
);



const visibleCharacters = computed(() =>
  stage.characters.filter(c => !c.hidden)
);



const backgroundStyle = computed(() => ({

  backgroundImage:
    `
linear-gradient(
rgba(10,15,30,.25),
rgba(10,15,30,.65)
),
url(${resolveBackground(stage.background)})
`,

}));



function resolveBackground(name: string) {

  if (!name)
    return "";


  const bg =
    assets.value.backgrounds?.[name];


  if (typeof bg === "string")
    return bg;


  return `${props.assetsBase}/backgrounds/${name}.png`;

}



function resolveSprite(id: string, emotion = "neutral") {

  const char =
    characters.value[id];


  const img =
    char?.emotions?.[emotion];


  if (typeof img === "string")
    return img;


  return `${props.assetsBase}/characters/${id}/${emotion}.png`;

}




function nameOf(id: string) {

  return characters.value[id]?.name || id;

}





function setCharacter(data: any) {

  const old =
    stage.characters.find(
      c => c.id === data.id
    );


  if (old) {

    old.slot =
      data.slot || old.slot;


    old.emotion =
      data.emotion || old.emotion;


    old.hidden = false;


    return;

  }



  stage.characters.push({

    id: data.id,

    slot: data.slot || "center",

    emotion: data.emotion || "neutral",

    hidden: false

  });


}




function removeCharacter(id: string) {

  stage.characters =
    stage.characters.filter(
      c => c.id !== id
    );

}





function applyScene(scene: any) {

  stage.background =
    scene?.initialState?.background || "";


  stage.characters =
    (scene?.initialState?.visibleCharacters || [])
      .map((c: any) => ({

        id: c.id,

        slot: c.slot || "center",

        emotion: c.emotion || "neutral",

        hidden: false

      }));

}





function process(step: any) {

  dialogue.value = null;
  systemText.value = "";


  if (!step) return;



  switch (step.type) {


    case "say":

      setCharacter({

        id: step.speaker,

        emotion: step.emotion,

      });


      dialogue.value = {

        speaker: step.speaker,

        text: step.text

      };

      break;




    case "system":

      systemText.value =
        step.text;

      break;



    case "background":

      stage.background =
        step.background;

      break;




    case "enter":

      setCharacter({

        id: step.character || step.target,

        slot: step.slot,

        emotion: step.emotion

      });

      break;



    case "exit":

      removeCharacter(
        step.character || step.target
      );

      break;




    case "emotion":

      setCharacter({

        id: step.character || step.target,

        emotion: step.emotion

      });

      break;



    case "transition":

      transition.value = true;


      setTimeout(() => {

        transition.value = false;

      }, 400);


      break;


  }



}





function start() {

  started.value = true;

  sceneIndex.value = 0;

  stepIndex.value = -1;


  applyScene(
    currentScene.value
  );


  next();

}





function next() {


  if (!started.value) {

    start();

    return;

  }



  const steps =
    currentScene.value?.steps || [];


  stepIndex.value++;


  if (stepIndex.value >= steps.length) {

    sceneIndex.value++;


    stepIndex.value = -1;


    if (sceneIndex.value >= scenes.value.length) {

      return;

    }


    applyScene(
      currentScene.value
    );


    next();

    return;

  }



  process(
    steps[stepIndex.value]
  );



}




function previous() {

  stepIndex.value =
    Math.max(
      stepIndex.value - 1,
      0
    );


  process(
    currentScene.value.steps[
    stepIndex.value
    ]);

}





function handleClick() {

  if (!transition.value)
    next();

}




onMounted(() => {

  if (props.autoStart)

    start();

});


</script>




<template>


  <div class="vn-player" :style="backgroundStyle" @click="handleClick">



    <div class="vn-stage">


      <TransitionGroup name="character">


        <div v-for="char in visibleCharacters" :key="char.id" class="character" :class="[

          `slot-${char.slot}`,

          {

            active:
              dialogue?.speaker === char.id,

            dim:
              dialogue &&
              dialogue.speaker !== char.id

          }

        ]">


          <img :src="resolveSprite(char.id, char.emotion)" :alt="nameOf(char.id)">


        </div>


      </TransitionGroup>



    </div>





    <div v-if="transition" class="transition-layer">
    </div>







    <div class="dialogue">


      <div v-if="dialogue">


        <div class="speaker">

          {{ nameOf(dialogue.speaker) }}

        </div>


        <div class="text">

          {{ dialogue.text }}

        </div>


      </div>



      <div v-else-if="systemText" class="text">

        {{ systemText }}

      </div>





      <div class="buttons">


        <button @click.stop="previous">
          ←
        </button>



        <button @click.stop="next">
          →
        </button>


      </div>


    </div>



  </div>


</template>





<style scoped>
.vn-player {

  position: relative;

  min-height: 100vh;

  overflow: hidden;

  background-size: cover;

  background-position: center;

}



.vn-stage {
  position: absolute;
  inset: 0;
  pointer-events: none;
}



.character {

  position: absolute;

  bottom: 160px;

  width: 280px;

  height: 620px;

  transition: .45s ease;

  display: flex;

  align-items: end;

  justify-content: center;

}



.character img {

  width: 100%;

  height: 100%;

  object-fit: contain;

  object-position: bottom;

  animation: breathe 4s infinite ease-in-out;

}




.character.active {

  transform:
    translateY(-20px) scale(1.05);

  filter:
    brightness(1.15);

  z-index: 5;

}



.character.dim {

  opacity: .45;

  filter:
    brightness(.65);

}




/* 6 positions */

.slot-far-left {
  left: 2%;
}

.slot-left {
  left: 18%;
}

.slot-center-left {
  left: 32%;
}

.slot-center-right {
  right: 32%;
}

.slot-right {
  right: 18%;
}

.slot-far-right {
  right: 2%;
}







.dialogue {

  position: absolute;

  bottom: 25px;

  left: 50%;

  transform: translateX(-50%);

  width: min(1000px, 90%);

  padding: 25px;

  border-radius: 25px;

  background:
    rgba(15, 23, 42, .75);

  backdrop-filter: blur(15px);

  color: white;

  z-index: 20;

}



.speaker {

  color: #7AF6EB;

  font-weight: 800;

  text-transform: uppercase;

  margin-bottom: 10px;

}



.text {

  font-size: 24px;

  line-height: 1.5;

}




.buttons {

  display: flex;

  justify-content: space-between;

  margin-top: 20px;

}



button {

  width: 54px;

  height: 54px;

  border-radius: 50%;

  border: 1px solid rgba(255, 255, 255, .2);

  background:
    rgba(255, 255, 255, .15);

  color: white;

  font-size: 22px;

  transition: .3s;

}



button:hover {

  background: #7AF6EB;

  color: #111;

  transform: scale(1.1);

}




.transition-layer {

  position: absolute;

  inset: 0;

  background: black;

  z-index: 50;

  animation: fade .4s;

}



@keyframes fade {

  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }

}




@keyframes breathe {

  0%,
  100% {

    transform:
      translateY(0);

  }


  50% {

    transform:
      translateY(-8px);

  }

}





.character-enter-active,
.character-leave-active {

  transition: .45s;

}


.character-enter-from,
.character-leave-to {

  opacity: 0;

  transform:
    translateY(80px) scale(.9);

}





@media(max-width:900px) {


  .character {

    width: 170px;

    height: 420px;

    bottom: 180px;

  }



  .slot-far-left,
  .slot-far-right {

    display: none;

  }



  .slot-left {

    left: 5%;

  }


  .slot-center-left {

    left: 20%;

  }


  .slot-center-right {

    right: 20%;

  }


  .slot-right {

    right: 5%;

  }



  .text {

    font-size: 18px;

  }



  .dialogue {

    bottom: 10px;

    padding: 18px;

  }



}
</style>