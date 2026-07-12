<script setup lang="ts">

import { ref, computed } from "vue";

import TeamMemberCard from "./TeamMemberCard.vue";

import { teamMembers } from "../../data/team";


const activeIndex = ref(0);



const activeMember = computed(() => {

    return teamMembers[activeIndex.value];

});



function selectMember(index: number) {

    activeIndex.value = index;

}


</script>



<template>

    <section class="py-20">

        <div class="mx-auto w-full max-w-[1280px] px-4">



            <div class="mb-10 flex justify-center">

                <h2 class="
font-handil
text-4xl
uppercase
text-white
md:text-6xl
">
                    Команда
                </h2>

            </div>





            <!-- ACTIVE CARD -->

            <Transition name="card" mode="out-in">


                <div :key="activeMember.name">

                    <TeamMemberCard :name="activeMember.name" :role="activeMember.role" :image="activeMember.image"
                        :stats="activeMember.stats" />

                </div>


            </Transition>







            <!-- PREVIEWS -->


            <div class="
mt-8
grid

grid-cols-1

gap-4

md:grid-cols-2

xl:grid-cols-3
">



                <button v-for="(member, index) in teamMembers" :key="member.name" @click="selectMember(index)" class="
group
overflow-hidden

rounded-2xl

border

border-cyan-400/30

bg-white/5

p-4

text-left

transition-all

duration-300

hover:-translate-y-2

hover:border-[#7AF6EB]

hover:bg-white/10

" :class="{

    'ring-2 ring-[#7AF6EB] bg-white/10':
        index === activeIndex

}">


                    <div class="
flex
items-center
gap-4
">


                        <img :src="member.image" :alt="member.name" class="
h-24
w-20

rounded-xl

object-cover

object-top

transition

duration-500

group-hover:scale-110

" />



                        <div>

                            <h3 class="
font-orbitron

text-lg

uppercase

text-white
">
                                {{ member.name }}
                            </h3>


                            <p class="
mt-1

text-sm

uppercase

tracking-[0.12em]

text-white/70
">
                                {{ member.role }}
                            </p>


                        </div>



                    </div>


                </button>



            </div>



        </div>

    </section>


</template>



<style scoped>
.card-enter-active,
.card-leave-active {

    transition:
        opacity .35s ease,
        transform .35s ease;

}


.card-enter-from {

    opacity: 0;

    transform:
        translateY(30px) scale(.96);

}


.card-leave-to {

    opacity: 0;

    transform:
        translateY(-30px) scale(.96);

}
</style>