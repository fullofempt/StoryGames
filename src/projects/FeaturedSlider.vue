<script setup lang="ts">
import { ref } from "vue";
import { projectRows } from "../data/projects-page.ts";

const projects = projectRows;

const current = ref(0);
const nextImage = ref(projects[0].image);
const animating = ref(false);


const activeProject = () => projects[current.value];


function changeSlide(index:number) {

    if (animating.value) return;


    const newIndex =
        index < 0
            ? projects.length - 1
            : index >= projects.length
            ? 0
            : index;


    if(newIndex === current.value) return;


    nextImage.value = projects[newIndex].image;

    animating.value = true;


    setTimeout(() => {

        current.value = newIndex;

        animating.value = false;

    },400);
}



function next(){

    changeSlide(current.value + 1);

}



function prev(){

    changeSlide(current.value - 1);

}

</script>



<template>

<section class="py-10 md:py-16">


<div class="relative mx-auto w-full max-w-[1660px]">


    <!-- Glow -->

    <div
        class="
        absolute
        inset-0
        rounded-[40px]
        md:rounded-[60px]
        bg-white
        blur-[8px]
        opacity-25
        "
    ></div>



    <!-- IMAGE -->

    <div
        class="
        relative
        overflow-hidden
        rounded-[40px]
        border-[6px]
        border-white/90
        bg-black
        md:rounded-[60px]
        md:border-[10px]
        "
    >


        <!-- current image -->

        <img
            :src="activeProject().image"
            :alt="activeProject().title"
            class="
            absolute
            inset-0
            h-full
            w-full
            object-contain
            bg-black
            "
        />



        <!-- next image -->

        <img
            v-if="animating"
            :src="nextImage"
            class="
            relative
            z-10
            h-[260px]
            w-full
            object-contain
            bg-black
            animate-image
            md:h-[520px]
            lg:h-[760px]
            "
        />


        <img
            v-else
            :src="activeProject().image"
            :alt="activeProject().title"
            class="
            relative
            z-10
            h-[260px]
            w-full
            object-contain
            bg-black
            md:h-[520px]
            lg:h-[760px]
            "
        />


    </div>





    <!-- CONTROLS -->

    <div
        class="
        relative
        z-20
        mt-6
        flex
        items-center
        justify-between
        px-4
        md:px-10
        "
    >



        <!-- PREV -->

        <button
            type="button"
            @click="prev"
            class="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-white/20
            text-xl
            text-white
            backdrop-blur
            transition-all
            duration-300
            hover:scale-110
            hover:bg-[#7AF6EB]/30
            hover:text-[#7AF6EB]
            md:h-[54px]
            md:w-[54px]
            md:text-2xl
            "
        >
            ←
        </button>




        <!-- TITLE -->

        <Transition
            name="fade"
            mode="out-in"
        >

            <h2
                :key="activeProject().title"
                class="
                max-w-[60%]
                text-center
                font-handil
                text-2xl
                uppercase
                text-white
                md:text-5xl
                lg:text-6xl
                "
            >
                {{ activeProject().title }}
            </h2>

        </Transition>




        <!-- NEXT -->

        <button
            type="button"
            @click="next"
            class="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-white/20
            text-xl
            text-white
            backdrop-blur
            transition-all
            duration-300
            hover:scale-110
            hover:bg-[#7AF6EB]/30
            hover:text-[#7AF6EB]
            md:h-[54px]
            md:w-[54px]
            md:text-2xl
            "
        >
            →
        </button>


    </div>



</div>

</section>

</template>



<style scoped>


.animate-image {

    animation: imageFade .4s ease forwards;

}



@keyframes imageFade {

    from {

        opacity:0;

        transform:scale(1.04);

    }


    to {

        opacity:1;

        transform:scale(1);

    }

}




.fade-enter-active,
.fade-leave-active {

    transition:
        opacity .3s ease,
        transform .3s ease;

}



.fade-enter-from {

    opacity:0;

    transform:translateY(15px);

}



.fade-leave-to {

    opacity:0;

    transform:translateY(-15px);

}



</style>