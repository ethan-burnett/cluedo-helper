<template>
    <b-card :style="'background-color: ' + colour" align="center" border-variant="secondary">
        <b-row>
            <b-col>
                {{ card.name }}
                <b-icon-star-fill v-if="card.isTheOne" variant="warning"></b-icon-star-fill>
                <b-icon-x v-else-if="card.isFound"></b-icon-x>
                <b-icon-blank v-else></b-icon-blank>
            </b-col>
        </b-row>
    </b-card>
</template>

<script>
    export default {
        name: "CluedoCard",
        props: {
            card: Object,
            players: Array
        },
        data() {
            return {
                colour: 'whitesmoke' // not found
            }
        },
        mounted() {
            this.findColour();
        },
        methods: {
            findColour() {
                for (let i = 0; i < this.card.players.length; i++) {
                    if (this.card.players[i].value === 'O') {
                        this.colour = this.players[i].character.colour;
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>