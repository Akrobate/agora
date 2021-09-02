<template>
    <v-container>

        <v-spacer class="my-8"/>

        <div class="row">
            <div class="col-6">
                <h3>Transition</h3>
                
                <button class="btn btn-secondary button" @click="sort">
                    To original order
                </button>

                <v-simple-table>

                    <thead>
                        <tr>
                        <th class="text-left">
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
    name: "PropositionManualSortElement",
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