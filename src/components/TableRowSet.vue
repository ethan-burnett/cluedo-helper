<template>
    <div>
        <b-row v-for="card in cards" :key="card.id">
            <b-col style="text-align: start" cols="3">{{ card.name }}</b-col>
            <b-col cols="1" v-for="player in card.players" :key="player.pos">
                <div v-if="player.value === ' '">
                    <b-icon-square></b-icon-square>
                </div>
                <div v-else-if="player.value === '/'">
                    <b-icon-square-fill variant="danger"></b-icon-square-fill>
                </div>
                <div v-else-if="player.value === 'O'">
                    <b-icon-square-fill variant="success"></b-icon-square-fill>
                </div>
            </b-col>
            <b-col cols="3" v-if="card.isTheOne">
                <b-icon-star-fill variant="warning"></b-icon-star-fill>
            </b-col>
            <b-col cols="3" v-else-if="isManual(card.id)">
                <b-icon-arrow-counterclockwise variant="secondary" @click="undoAssignCard(card.id)"/>
            </b-col>
            <b-col cols="3" v-else>
                <b-icon-blank></b-icon-blank>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    export default {
        name: "TableRowSet",
        props: {
            cards: Array,
            assignedManually: Array
        },
        methods: {
            isManual(id) {
                let foundCardsWithId = this.assignedManually.filter(event => id === event.card.id);
                return foundCardsWithId.length > 0;
            },
            undoAssignCard(id) {
                this.$emit("undo-assign-card", id);
            }
        }
    }
</script>

<style scoped>

</style>