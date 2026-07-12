<script setup lang="ts">

interface Stat {
    label: string;
    value: number;
}


defineProps<{
    name: string;
    role: string;
    image: string;
    stats: Stat[];
}>();


const getBarClass = (index: number) => {

    const classes = [
        'bg-[#87FF1F]',
        'bg-[#FFDD1F]',
        'bg-[#FF8F1F]',
        'bg-[#FF4C1F]',
        'bg-[#FF1F1F]',
    ];


    return classes[index] ?? 'bg-[#87FF1F]';

};


</script>



<template>

    <article class="
relative
overflow-hidden
rounded-[20px]

border-[3px]
border-[#00A8CE]

bg-gradient-to-b
from-[#190925]/80
via-[#9A4760]/80
to-[#190925]/80

shadow-[0_12px_40px_rgba(0,0,0,.35)]

transition-all
duration-500

hover:-translate-y-2
hover:shadow-[0_0_40px_rgba(0,168,206,.35)]
">


        <div class="
grid

lg:grid-cols-[360px_1fr]
">


            <!-- IMAGE -->

            <div class="
relative

min-h-[360px]

overflow-hidden

border-b
border-cyan-400/30

lg:min-h-[560px]

lg:border-b-0

lg:border-r
">


                <div class="
absolute
inset-0

bg-[radial-gradient(circle_at_center,rgba(0,168,206,.25),transparent_70%)]
" />


                <img :src="image" :alt="name" class="
relative
z-10

h-full
w-full

object-cover
object-top

transition

duration-700

hover:scale-105
" />


            </div>





            <!-- INFO -->


            <div class="
p-6
md:p-8
lg:p-10
">


                <h3 class="
font-handil

text-4xl

uppercase

text-white

md:text-6xl
">
                    {{ name }}
                </h3>


                <p class="
mt-2

text-xl

uppercase

tracking-[.2em]

text-white/70
">
                    {{ role }}
                </p>





                <div class="
mt-8

space-y-6
">


                    <div v-for="stat in stats" :key="stat.label">


                        <div class="
mb-3

flex

justify-between

text-white
">

                            <span class="font-handil text-xl uppercase">
                                {{ stat.label }}
                            </span>


                            <span class="text-white/50">
                                {{ stat.value }}/5
                            </span>


                        </div>



                        <div class="flex gap-2">

                            <span v-for="(_, index) in 5" :key="index" class="
h-[18px]
w-[43px]

rounded-[5px]

transition-all
duration-300

" :class="index < stat.value
        ? getBarClass(index)
        : 'bg-white/10 border border-white/10'
    " />

                        </div>


                    </div>


                </div>


            </div>


        </div>


    </article>


</template>