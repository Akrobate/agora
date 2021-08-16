<template>
    <v-container style="max-width: 1280px; min-width: 795px">
        <h1 class="text-h5 mt-8">EloGamePage</h1>


        <div >
        <v-row
            align="center"
            justify="center"
            no-gutters
            style="height: 250px;"
            class="mb-16 mt-8"
        >

            <v-col class="col-5 fill-height" >
                <v-hover v-slot="{ hover }">
                    <v-card
                        class="px-6 fill-height rounded-xl proposition-card"
                        :elevation="hover ? 13 : 4"         
                    >
                        <v-layout align-center fill-height>
                            <v-flex>
                                <p class="text-h5 text--secondary">
                                    "Turns out semicolon-less style is easier and safer in TS because most gotcha edge cases are type invalid as well."
                                </p>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-hover>
            </v-col>

            <v-spacer />
            
            <v-col class="col-1" @click="is_loading = !is_loading">
                <p class="text-h2" align="center" @click="suffle"  v-if="!is_loading">
                    VS
                </p>

                <div align="center" v-if="is_loading">
                    <v-progress-circular
                        :size="50"
                        color="primary"
                        indeterminate
                        ></v-progress-circular>
                </div>
            </v-col>
            <v-spacer />




            <v-col class="col-5 fill-height" >
                <v-hover v-slot="{ hover }" >
                    <v-card
                        class="px-6 fill-height rounded-xl proposition-card"
                        :elevation="hover ? 13 : 4"         
                    >
                        <v-layout align-center fill-height>
                            <v-flex>
                                <p class="text-h5 text--secondary">
                                    "Turns out semicolon-less style is easier and safer in TS because most gotcha edge cases are type invalid as well."
                                </p>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-hover>
            </v-col>

        </v-row>

        </div>



        <!-- LIST ---->
        <!-- LIST ---->
        <!-- LIST ---->
        <!-- LIST ---->


        
        <v-simple-table>
            <template v-slot:default>
            <thead>
                <tr>
                <th class="text-left">
                    Proposition
                </th>
                <th class="text-right">
                    ELO score
                </th>
                </tr>
            </thead>
            <tbody name="list" is="transition-group">
                <tr
                v-for="item in desserts"
                :key="item.name"
                >
                    <td class="text-left">{{ item.name }}</td>
                    <td class="text-right">{{ item.calories }}</td>
                </tr>
            </tbody>
            </template>
        </v-simple-table>

    </v-container>

</template>

<script>

export default {
    name: "EloGamePage",
    methods: {
        suffle() {
            this.desserts = this.desserts.sort(() => 0.5 - Math.random());
        },
    },
    data() {
        return {
            is_loading: true,
            desserts: [
                {
                    name: 'Frozen Yogurt',
                    calories: 159,
                },
                {
                    name: 'Ice cream sandwich',
                    calories: 237,
                },
                {
                    name: 'Eclair',
                    calories: 262,
                },
                {
                    name: 'Cupcake',
                    calories: 305,
                },
                {
                    name: 'Gingerbread',
                    calories: 356,
                },
                {
                    name: 'Jelly bean',
                    calories: 375,
                },
                {
                    name: 'Lollipop',
                    calories: 392,
                },
                {
                    name: 'Honeycomb',
                    calories: 408,
                },
                {
                    name: 'Donut',
                    calories: 452,
                },
                {
                    name: 'KitKat',
                    calories: 518,
                },
        ],
        };
    },
};
</script>


<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.8s;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
.list-move {
  transition: transform 1s;
  color: blue
}

.proposition-card {
    cursor: pointer;
}

</style>