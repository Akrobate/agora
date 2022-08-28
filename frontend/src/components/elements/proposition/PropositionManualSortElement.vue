<template>
    <v-container>

        <h1 class="text-h5 mt-8">{{ $t('your_results_title') }}</h1>
    
        <v-btn
            class="my-3"
            color=""
            @click="sort()"
            x-small
        >
            {{ $t('reinit_order_button') }}
        </v-btn>


        <v-simple-table>

            <thead>
                <tr>
                    <th class="text-left" scope="col">
                        {{ $t('proposition_table_label') }}
                    </th>
                    <th class="text-left" scope="col">
                        {{ $t('rank_table_label') }}
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
                            {{ element.payload }}
                        </td>
                        <td>
                            {{ element.rank }}
                        </td>
                    </tr>

            </draggable>

        </v-simple-table>
    </v-container>

</template>

<script>

import draggable from "vuedraggable";
import { mapActions, mapGetters } from 'vuex';

//https://github.com/SortableJS/Vue.Draggable/issues/61

export default {
    name: "PropositionManualSortElement",
    props: {
        campaign_id: Number,
    },
    components: {
        draggable
    },
    data() {
        return {
            list: [],
            drag: false
        };
    },
    async mounted() {
        await this.loadOwnPropositionResultList({
            campaign_id: this.campaign_id
        })
        this.list = this.propositionResultList.map((proposition, index) => {
                return { ...proposition, order: index + 1 }
        })
    },
    methods: {
        ...mapActions({
            loadOwnPropositionResultList: 'user_proposition_store/loadOwnPropositionResultList',
        }),
        sort() {
            this.list = this.list.sort((a, b) => a.order - b.order);
        }
    },
    computed: {
        ...mapGetters({
            propositionResultList: 'user_proposition_store/propositionResultList',
        }),
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

<i18n locale='fr'>
{
    "your_results_title": "Votre classement",
    "reinit_order_button": "Reinitialiser l'ordre",
    "proposition_table_label": "Proposition",
    "rank_table_label": "Rang"
}
</i18n>