<template>
    <b-modal centered size="lg" @change="isBtnActive = true" id="addRumourModal" ok-only ok-title="Back"
             ok-variant="secondary"
             title="Add a rumour">
        <b-row>
            <b-col>
                <p>Who</p>
                <b-form-select id="whoRumourSelect"
                               v-model="activeWho"
                               :options="characters"></b-form-select>
            </b-col>
            <b-col>
                <p>What</p>
                <b-form-select id="whatRumourSelect"
                               v-model="activeWhat"
                               :options="weapons"></b-form-select>
            </b-col>
            <b-col>
                <p>Where</p>
                <b-form-select id="whereRumourSelect"
                               v-model="activeWhere"
                               :options="rooms"></b-form-select>
            </b-col>
        </b-row>
        <br>
        <b-row>
            <b-col>
                <p>Which player answered?</p>
                <b-form-select id="playerWhoAnsweredSelect"
                               v-model="selectedOption"
                               :options="options"></b-form-select>
            </b-col>
        </b-row>
        <br>
        <b-row>
            <b-col>
                <b-button id="addRumourBtn"
                          variant="info"
                          pill block
                          :disabled="!isBtnActive"
                          @click="addRumour">
                    Add
                </b-button>
            </b-col>
        </b-row>
    </b-modal>
</template>

<script>
    import {characters, rooms, weapons} from "@/constants";

    export default {
        name: "AddRumourModal",
        props: {
            table: Object,
            players: Array
        },
        data() {
            return {
                characters: characters,
                weapons: weapons,
                rooms: rooms,
                options: [],
                selectedOption: -1,
                isBtnActive: true,
                activeWho: characters[0].value,
                activeWhat: weapons[0].value,
                activeWhere: rooms[0].value
            }
        },
        mounted() {
            this.options = [{text: 'No one', value: -1}];
            for (let i = 0; i < this.players.length; i++) {
                this.options.push({text: this.players[i].name, value: this.players[i].position})
            }
        },
        methods: {
            /**
             * Adds a rumour with the active who, what and where.
             */
            addRumour() {
                this.isBtnActive = false;
                let who, what, where;
                for (let i = 0; i < this.table.who.length; i++) {
                    if (this.activeWho.name === this.table.who[i].name) {
                        who = this.table.who[i].id;
                    }
                }
                for (let i = 0; i < this.table.what.length; i++) {
                    if (this.activeWhat.name === this.table.what[i].name) {
                        what = this.table.what[i].id;
                    }
                }
                for (let i = 0; i < this.table.where.length; i++) {
                    if (this.activeWhere.name === this.table.where[i].name) {
                        where = this.table.where[i].id;
                    }
                }
                let rumour = {
                    cards: [who, what, where],
                    isFinished: false,
                    playerWhoAnswered: this.selectedOption
                };
                this.$emit("add-rumour", rumour);
            }
        }
    }
</script>

<style scoped>

</style>