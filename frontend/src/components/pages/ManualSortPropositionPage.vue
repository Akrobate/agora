<template>
    <v-container>
        <h1 class="text-h5 mt-8">EloGamePage</h1>

        <v-spacer class="my-8"/>

        <v-row
            align="center"
            no-gutters
            style="height: 250px;"
        >

            <v-col class="ma-4 col-5 fill-height" >
                <v-card
                    class="px-6 fill-height rounded-xl"
                    elevation="13"         
                >
                    <v-layout align-center fill-height>
                        <v-flex>
                            <p class="text-h5 text--secondary">
                                "Turns out semicolon-less style is easier and safer in TS because most gotcha edge cases are type invalid as well."
                            </p>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-col>

            <v-col class="ma-4 col-1">
                <p class="text-h2" align="center">
                    VS
                </p>
            </v-col>





            <v-col class="ma-4 col-5 fill-height" >
                <v-card
                    class="px-6 fill-height rounded-xl"
                    elevation="13"         
                >
                    <v-layout align-center fill-height>
                        <v-flex>
                            <p class="text-h5 text--secondary">
                                "Turns out semicolon-less style is easier and safer in TS because most gotcha edge cases are type invalid as well."
                            </p>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-col>

<v-spacer />

        </v-row>



        <v-spacer />
        <v-spacer class="my-16"/>


        <!-- LIST ---->
        <!-- LIST ---->
        <!-- LIST ---->
        <!-- LIST ---->

        <div class="row">
            <div class="col-2">
            <button class="btn btn-secondary button" @click="sort">
                To original order
            </button>
            </div>

            <div class="col-6">
                <h3>Transition</h3>

            <v-simple-table>
                <thead>
                    <tr>
                        <th class="text-left" scope="col">
                            Name
                        </th>
                    </tr>
                </thead>

               
                <draggable
                    class="list-group"
                    tag="tbody"
                    v-model="list"
                    v-bind="dragOptions"
                    @start="drag = true"
                    @end="drag = false"
                >

                        <tr
                            class="list-group-item"
                            v-for="element in list"
                            :key="element.order"
                        >
                            <td>
                                {{ element.name }}
                            </td>
                        </tr>

                </draggable>

                </v-simple-table>
            </div>

        </div>

    </v-container>

</template>

<script>

import draggable from "vuedraggable";


// export default {
//     name: 'EloGamePage',
//     data: () => ({
//     }),
// }

//https://github.com/SortableJS/Vue.Draggable/issues/61

const message = [
  "vue.draggable",
  "draggable",
  "component",
  "for",
  "vue.js 2.0",
  "based",
  "on",
  "Sortablejs"
];
export default {
    name: "EloGamePage",
    display: "Transitions",
    order: 7,
    components: {
        draggable
    },
    data() {
        return {
            list: message.map((name, index) => {
                return { name, order: index + 1 };
            }),
            drag: false
        };
    },
    methods: {
        sort() {
            this.list = this.list.sort((a, b) => a.order - b.order);
        }
    },
    computed: {
        dragOptions() {
            return {
                animation: 400,
                disabled: false,
                ghostClass: "ghost"
            };
        }
    }
};
</script>


<style>
.button {
  margin-top: 35px;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.0;
  background: #c8ebfb;
}

.list-group-item {
  cursor: move;
}

</style>