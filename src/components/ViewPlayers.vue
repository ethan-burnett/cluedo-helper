<template>
    <b-card-group columns style="column-count: 3">
        <b-card v-for="player in players" :key="player.position" no-body
                :style="'background-color: ' + player.character.colour" border-variant="secondary">
            <b-card-header>
                <b-badge pill variant="warning">{{ player.position }}</b-badge>
                <b-badge>{{ player.cards.length }}/{{ cardsPerPerson }}</b-badge>
                <br>
                <h3>{{player.name}}</h3></b-card-header>
            <b-list-group flush>
                <b-list-group-item v-for="card in player.cards" :key="card.id"
                                   style="background-color: inherit; border-color: inherit">
                    <b-row>
                        <b-col>{{card.name}}</b-col>
                        <b-col v-if="isManual(card.id)"><div @click="undoAssignCard(card.id)"><b-icon-x/></div></b-col>
                        <b-col v-else><b-icon-blank/></b-col>
                    </b-row>
                </b-list-group-item>
            </b-list-group>
        </b-card>
    </b-card-group>
</template>

<script>
    export default {
        name: "ViewPlayers",
        props: {
            players: Array,
            cardsPerPerson: Number,
            assignedManually: Array
        },
        methods: {
            undoAssignCard(id) {
                this.$emit("undo-assign-card", id);
            },
            isManual(id) {
                let foundCardsWithId = this.assignedManually.filter(event => id === event.card.id);
                return foundCardsWithId.length > 0;
            },
        }
    }
</script>

<style scoped>

    .row {
    white-space: nowrap;
    }

    .row > div {
    display: inline-block;
    }

</style>