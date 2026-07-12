<script setup lang="ts">

import { ref } from "vue";


const active = ref("news");


const tabs = [
    {
        label: "Новости",
        key: "news",
    },
    {
        label: "Девблог",
        key: "devblog",
    },
];



function changeTab(key: string) {

    active.value = key;

    window.dispatchEvent(
        new CustomEvent("news-change", {
            detail: key
        })
    );

}


</script>



<template>

    <div class="mx-auto w-full max-w-[785px] rounded-full">

        <div class="grid grid-cols-2 gap-1">


            <button v-for="tab in tabs" :key="tab.key" @click="changeTab(tab.key)" :class="[

                'h-[40px] rounded-full text-center font-light text-[20px] uppercase text-white transition md:text-2xl lg:text-[25px]',

                active === tab.key
                    ? 'bg-white/20'
                    : 'bg-white/5 hover:bg-white/20'

            ]">

                {{ tab.label }}

            </button>


        </div>

    </div>


</template>