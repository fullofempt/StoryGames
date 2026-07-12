<script setup lang="ts">

import { ref, computed, onMounted, onUnmounted } from "vue";

import {
    newsList,
    devblogList
} from "../data/news-page";



const current = ref(0);

const animating = ref(false);

const nextImage = ref("");



const currentType = ref<"news" | "devblog">("news");



const items = computed(() => {

    return currentType.value === "devblog"
        ? devblogList
        : newsList;

});



const activeNews = computed(() => {

    return items.value[current.value];

});





// переключение вкладок

function changeCategory(type: "news" | "devblog") {


    if (type === currentType.value)
        return;



    currentType.value = type;


    current.value = 0;


    nextImage.value =
        items.value[0].image;


    animating.value = true;



    setTimeout(() => {

        animating.value = false;

    }, 400);


}




function change(index: number) {


    if (animating.value)
        return;



    const length = items.value.length;



    const newIndex =
        index < 0
            ? length - 1
            : index >= length
                ? 0
                : index;



    nextImage.value =
        items.value[newIndex].image;



    animating.value = true;



    setTimeout(() => {


        current.value = newIndex;


        animating.value = false;


    }, 400);



}




function next() {

    change(current.value + 1);

}




function prev() {

    change(current.value - 1);

}





function listener(event: any) {

    changeCategory(event.detail);

}




onMounted(() => {

    window.addEventListener(
        "news-change",
        listener
    );

});



onUnmounted(() => {

    window.removeEventListener(
        "news-change",
        listener
    );

});



</script>





<template>


    <section class="py-10 md:py-16">


        <div class="relative mx-auto max-w-[1560px] px-4">



            <div class="
absolute
inset-0
rounded-[40px]
bg-white
opacity-20
blur-xl
">
            </div>





            <article class="
relative
overflow-hidden
rounded-[40px]
border
border-white/10
bg-white/5
backdrop-blur-md
">



                <div class="
grid
lg:grid-cols-[760px_1fr]
">





                    <!-- IMAGE -->

                    <div class="
relative
overflow-hidden
bg-black/20

h-[300px]

md:h-[450px]

lg:h-[740px]
">


                        <Transition name="fade">


                            <img :key="activeNews.image" :src="activeNews.image" :alt="activeNews.title" class="
absolute
inset-0
h-full
w-full
object-contain
" />


                        </Transition>




                        <Transition name="fade">


                            <img v-if="animating" :key="nextImage" :src="nextImage" class="
absolute
inset-0
z-10
h-full
w-full
object-contain
" />


                        </Transition>


                    </div>






                    <!-- CONTENT -->

                    <div class="
flex
flex-col
justify-between

bg-[rgba(217,217,217,0.18)]

px-6
py-8

md:px-10

lg:py-10
">


                        <div>



                            <h2 class="
font-manrope
font-extrabold
text-white

text-3xl

md:text-5xl

lg:text-[58px]
lg:leading-[76px]
">

                                {{ activeNews.title }}

                            </h2>



                            <p class="
mt-6
whitespace-pre-line

font-manrope

text-white/90

text-sm
leading-6

md:text-base

lg:text-[25px]
lg:leading-[34px]
">

                                {{ activeNews.excerpt }}

                            </p>


                        </div>







                        <!-- BUTTONS -->


                        <div class="
mt-8
flex
items-center
justify-between
">


                            <button @click="prev" class="
flex
h-12
w-12

md:h-[54px]
md:w-[54px]

items-center
justify-center

rounded-full

bg-white/20

text-xl
text-white

transition

hover:scale-110

hover:bg-[#7AF6EB]/30
">

                                ←

                            </button>




                            <div class="
text-sm
uppercase
tracking-widest
text-white/50
">

                                {{ current + 1 }} / {{ items.length }}

                            </div>




                            <button @click="next" class="
flex
h-12
w-12

md:h-[54px]
md:w-[54px]

items-center
justify-center

rounded-full

bg-white/20

text-xl
text-white

transition

hover:scale-110

hover:bg-[#7AF6EB]/30
">

                                →

                            </button>


                        </div>



                    </div>



                </div>


            </article>



        </div>


    </section>



</template>






<style scoped>
.fade-enter-active,
.fade-leave-active {

    transition:
        opacity .4s ease,
        transform .4s ease;

}


.fade-enter-from {

    opacity: 0;

    transform: scale(1.05);

}


.fade-leave-to {

    opacity: 0;

    transform: scale(.98);

}
</style>