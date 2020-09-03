<template>
    <b-modal id="assignCardsModal" centered ok-only ok-title="Back" ok-variant="secondary"
             title="Assign some cards">
        <p>Select the type of card</p>
        <b-tabs id="assignCardTabs" v-model="tabIndex" content-class="mt-3">
            <b-tab id="whoTab" title="Who" active>
                <p>Which character card do they have?</p>
                <b-form-select id="whoCardSelect"
                               v-model="activeWho"
                               :options="characters"></b-form-select>
            </b-tab>
            <b-tab id="whatTab" title="What">
                <p>Which weapon card do they have?</p>
                <b-form-select id="whatCardSelect"
                               v-model="activeWhat"
                               :options="weapons"></b-form-select>
            </b-tab>
            <b-tab id="whereTab" title="Where">
                <p>Which location card do they have?</p>
                <b-form-select id="whereCardSelect"
                               v-model="activeWhere"
                               :options="rooms"></b-form-select>
            </b-tab>
        </b-tabs>
        <br>
        <b-row>
            <b-col>
                <p>Which player has this card?</p>
                <b-form-select id="playerAssigningSelect"
                               v-model="selectedOption"
                               :options="options"></b-form-select>
            </b-col>
        </b-row>
        <br>
        <b-button id="assignCardBtn"
                  variant="info"
                  block pill
                  :disabled="!isBtnActive"
                  @click="assignCard">
            Assign Card
        </b-button>
    </b-modal>
</template>

<script>
    import {characters, rooms, weapons} from "@/constants";

    export default {
        name: "AssignCardsModal",
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
                selectedOption: 0,
                isBtnActive: true,
                activeWho: characters[0].value,
                activeWhat: weapons[0].value,
                activeWhere: rooms[0].value,
                tabIndex: 0
            }
        },
        mounted() {
            this.options = [{text: "No one, and this isn't the answer", value: 0}];
            for (let i = 0; i < this.players.length; i++) {
                this.options.push({text: this.players[i].name, value: this.players[i].position})
            }
        },
        methods: {
            /**
             * Sends the card and player position to the parent component.
             */
            assignCard() {
                this.isBtnActive = false;
                let card, cards, active;
                if (this.tabIndex === 0) {
                    cards = this.table.who;
                    active = this.activeWho;
                } else if (this.tabIndex === 1) {
                    cards = this.table.what;
                    active = this.activeWhat;
                } else {
                    cards = this.table.where;
                    active = this.activeWhere;
                }
                for (let i = 0; i < cards.length; i++) {
                    if (active.name === cards[i].name) {
                        card = cards[i];
                    }
                }
                this.$emit('assign-card', {card: card, playerPos: this.selectedOption});
                setTimeout(() => this.isBtnActive = true, 1000)
            }
        }
    }
</script>

<style scoped>

</style>