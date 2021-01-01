<template>
    <div id="app">
        <h1>Cluedx</h1>
        <b-container v-if="!isSetUp">
            <!--Setting up-->
            <label>Add the players, including yourself</label>
            <br>
            <b-button block size="lg" variant="info" v-if="numberOfPlayers !== 6" v-on:click="addPlayer" pill>
                <b-icon-plus-circle></b-icon-plus-circle>
            </b-button>
            <br>
            <b-card style="background-color: whitesmoke" border-variant="secondary">
                <b-form-row>
                    <b-col sm="12" md="6" lg="2" v-for="player in players" :key="player.position">
                        <b-card :style="'background-color: ' + player.character.colour" border-variant="secondary">
                            <b-row>
                                <b-col align-self="start">
                                    <h2>
                                        <b-badge pill variant="warning">{{ player.position }}</b-badge>
                                    </h2>
                                </b-col>
                                <b-col align-self="end">
                                    <h3>
                                        <b-button v-if="numberOfPlayers > 2" v-on:click="removePlayer(player.position)"
                                                  variant="danger" pill>
                                            <b-icon-x-circle></b-icon-x-circle>
                                        </b-button>
                                    </h3>
                                </b-col>
                            </b-row>
                            <b-form-input :id="'name-input' + player.position" v-model="player.name" trim
                                          placeholder="Enter name"></b-form-input>
                            <b-form-select v-model="player.character" :options="characters"></b-form-select>
                        </b-card>
                    </b-col>
                </b-form-row>
            </b-card>
            <br>
            <b-button size="lg" block pill variant="info" @click="setUp" id="start-btn">Start</b-button>
        </b-container>
        <!--Main Game Environment-->
        <b-container style="max-width: 100%" v-else>
            <b-row>
                <b-col md="12" lg="7">
                    <!--Table-->
                    <Table :players="players" :table="table"></Table>
                </b-col>
                <b-col md="12" lg="5">
                    <b-card border-variant="secondary"
                            :style="'min-width: 35em; background-color: ' + players[activePlayerPosition-1].character.colour">
                        <!--Main Buttons/actions-->
                        <b-row>
                            <b-col cols="1" align-self="start">
                                <h2>
                                    <b-badge pill variant="warning">{{ activePlayerPosition }}</b-badge>
                                </h2>
                            </b-col>
                            <b-col align-self="start"><h2>{{activePlayerName}}'s turn</h2></b-col>
                        </b-row>
                        <hr style="border-color: inherit">
                        <b-row>
                            <b-col>
                                <b-button-group vertical>
                                    <b-button id="openViewRumoursModalBtn" pill variant="info"
                                              v-b-modal.viewRumoursModal>
                                        View Rumours
                                    </b-button>
                                    <b-button id="openAddRumourModalBtn" pill variant="info"
                                              v-b-modal.addRumourModal>
                                        Add Rumour
                                    </b-button>
                                    <b-button id="openAssignCardsModalBtn" pill variant="info"
                                              v-b-modal.assignCardsModal>
                                        Assign Cards
                                    </b-button>
                                </b-button-group>
                            </b-col>
                            <b-col align-self="center">
                                <b-button id="nextPlayerBtn" variant="info" pill size="lg"
                                          :disabled="!isBtnActive" @click="nextPlayer">Next
                                    <b-icon-arrow-right></b-icon-arrow-right>
                                </b-button>
                            </b-col>
                        </b-row>
                    </b-card>
                    <hr style="border-color: inherit">
                    <!--Players-->
                    <view-players :players="players" :cardsPerPerson="cardsPerPerson"></view-players>
                    <!--Add Rumour Modal-->
                    <add-rumour-modal :table="table" :players="players"
                                      @add-rumour="addRumour"></add-rumour-modal>
                    <!--View Rumours Modal-->
                    <b-modal id="viewRumoursModal" centered size="lg" scrollable ok-only ok-title="Back"
                             ok-variant="secondary"
                             title="Past rumours">
                        <section v-for="rumour in rumours" :key="rumour.id">
                            <b-card border-variant="secondary" style="background-color: whitesmoke">
                                <view-rumour :table="table" :players="players" :rumour="rumour"></view-rumour>
                            </b-card>
                            <br>
                        </section>
                    </b-modal>
                    <!--Assign Cards Modal-->
                    <assign-cards-modal :table="table" :players="players"
                                        @assign-card="assignCard"></assign-cards-modal>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    import 'bootstrap-vue/dist/bootstrap-vue.css'
    import {characters, weapons, rooms} from '@/constants';
    import Table from "@/components/Table";
    import AddRumourModal from "@/components/AddRumourModal";
    import AssignCardsModal from "@/components/AssignCardsModal";
    import ViewRumour from "@/components/ViewRumour";
    import ViewPlayers from "@/components/ViewPlayers";

    export default {
        name: 'App',
        components: {ViewPlayers, ViewRumour, AssignCardsModal, AddRumourModal, Table},
        data() {
            return {
                characters: characters,
                weapons: weapons,
                rooms: rooms,
                isSetUp: false,
                isSolved: false,
                isBtnActive: true,
                success: false,
                fail: false,
                numberOfPlayers: 2,
                cardsPerPerson: 8,
                numberOfCards: 19,
                myPosition: '',
                activePlayerPosition: 0, // start at zero so nextPlayer() moves to the first player
                activePlayerName: '',
                activeWho: characters[0].value,
                activeWhat: weapons[0].value,
                activeWhere: rooms[0].value,
                solution: [],
                nextId: 0,
                nextPosition: 3,
                rumours: [
                    {
                        cards: [],
                        isFinished: false,
                        playerPosition: null, // Rumour caster
                        playerWhoAnswered: null // Rumour falsifier
                    }
                ],
                table: {
                    who: [
                        {
                            name: '',
                            id: null,
                            isTheOne: false,
                            isFound: false,
                            players: []
                        }
                    ],
                    what: [
                        {
                            name: '',
                            id: null,
                            isTheOne: false,
                            isFound: false,
                            players: []
                        }
                    ],
                    where: [
                        {
                            name: '',
                            id: null,
                            isTheOne: false,
                            isFound: false,
                            players: []
                        }
                    ]
                },
                players: [
                    {
                        name: '',
                        position: 1,
                        isMe: false,
                        character: characters[0].value,
                        cards: []
                    }
                ]
            }
        },
        mounted() {
            this.rumours = [];
            this.players.push({
                name: '',
                position: 2,
                isMe: false,
                character: characters[1].value,
                cards: []
            });
            this.table.who = [];
            this.table.what = [];
            this.table.where = [];
        },
        watch: {
            numberOfPlayers() {
                this.cardsPerPerson = Math.floor(16 / this.numberOfPlayers);
            }
        },
        methods: {
            contradiction(message) {
                console.log("Contradiction detected:", message);
            },
            /**
             * Get the card from the real cards via the given ID
             */
            getCard(id) {
                for (let i = 0; i < this.table.who.length; i++) {
                    if (this.table.who[i].id === id) return this.table.who[i];
                }
                for (let i = 0; i < this.table.what.length; i++) {
                    if (this.table.what[i].id === id) return this.table.what[i];
                }
                for (let i = 0; i < this.table.where.length; i++) {
                    if (this.table.where[i].id === id) return this.table.where[i];
                }
            },
            /**
             * Set the card to the real card via the given ID
             */
            setCard(id, card) {
                for (let i = 0; i < this.table.who.length; i++) {
                    if (this.table.who[i].id === id) {
                        this.table.who[i] = card;
                    }
                }
                for (let i = 0; i < this.table.what.length; i++) {
                    if (this.table.what[i].id === id) {
                        this.table.what[i] = card;
                    }
                }
                for (let i = 0; i < this.table.where.length; i++) {
                    if (this.table.where[i].id === id) {
                        this.table.where[i] = card;
                    }
                }
            },
            processPlayers() {
                let isUpdated = false;
                for (let pos = 1; pos <= this.numberOfPlayers; pos++) {
                    let player = this.players[pos - 1];

                    let cards = this.table.who.concat(this.table.what).concat(this.table.where);
                    cards = cards.filter(j => j.players[pos - 1].value !== '/');
                    if (cards.length <= this.cardsPerPerson) {
                        for (let i = 0; i < cards.length; i++) {
                            if (cards[i].players[pos - 1].value === ' ') {
                                player.cards.push(cards[i]);
                                this.giveCard(cards[i], pos);
                                isUpdated = true;
                            }
                        }
                    }

                    if (player.cards.length === this.cardsPerPerson) {
                        for (let i = 0; i < this.numberOfCards; i++) {
                            let card = this.getCard(i);
                            if (card.players[pos - 1].value === ' ') {
                                card.players[pos - 1].value = '/';
                                isUpdated = true;
                                this.setCard(i, card);
                            }
                        }
                    }

                    this.players[pos - 1] = player;
                }
                return isUpdated;
            },
            processIsTheOne(tableCards) {
                let isUpdated = false;
                let foundIsTheOne = tableCards.filter(card => card.isTheOne).length >= 1;
                let cards = tableCards.filter(card => !card.isFound || card.isTheOne);
                if (cards.length === 1 && !foundIsTheOne) {
                    cards[0].isTheOne = true;
                    this.giveCard(cards[0], 0);
                    isUpdated = true;
                }
                if (cards.length > 1 && !foundIsTheOne) {
                    for (let i = 0; i < cards.length; i++) {
                        let isAllSlashed = true;
                        for (let j = 0; j < this.numberOfPlayers; j++) {
                            if (cards[i].players[j].value !== '/' ) isAllSlashed = false;
                        }
                        if (isAllSlashed && !cards[i].isFound) {
                            cards[i].isTheOne = true;
                            this.giveCard(cards[i], 0);
                            isUpdated = true;
                            break;
                        }
                    }
                }
                return isUpdated;
            },
            processCards() {
                let isUpdated = false;
                if (this.processIsTheOne(this.table.who)) isUpdated = true;
                if (this.processIsTheOne(this.table.what)) isUpdated = true;
                if (this.processIsTheOne(this.table.where)) isUpdated = true;
                return isUpdated;
            },
            processRumours() {
                let isUpdated = false;
                for (let i = 0; i < this.rumours.length; i++) {
                    let rumour = this.rumours[i], cards = [];
                    if (!rumour.isFinished) { // Rumour is pending
                        let who = this.getCard(rumour.cards[0]);
                        let what = this.getCard(rumour.cards[1]);
                        let where = this.getCard(rumour.cards[2]);
                        if (who.players[rumour.playerWhoAnswered - 1].value === ' ') {
                            cards.push(who);
                        } else if (who.players[rumour.playerWhoAnswered - 1].value === 'O') {
                            rumour.isFinished = true;
                        }
                        if (what.players[rumour.playerWhoAnswered - 1].value === ' ') {
                            cards.push(what);
                        } else if (what.players[rumour.playerWhoAnswered - 1].value === 'O') {
                            rumour.isFinished = true;
                        }
                        if (where.players[rumour.playerWhoAnswered - 1].value === ' ') {
                            cards.push(where);
                        } else if (where.players[rumour.playerWhoAnswered - 1].value === 'O') {
                            rumour.isFinished = true;
                        }
                        if (!rumour.isFinished && cards.length === 0) {
                            this.contradiction(`rumour (${who.name}, ${what.name}, ${where.name}) ` +
                            `asked by "${this.players[rumour.playerPosition - 1].name}" and answered by "` +
                            `${this.players[rumour.playerWhoAnswered - 1].name}". "` +
                            `${this.players[rumour.playerWhoAnswered - 1].name}" can't have any of the give cards!`);
                        }
                        else if (!rumour.isFinished && cards.length === 1) {
                            isUpdated = true;
                            this.players[rumour.playerWhoAnswered - 1].cards.push(cards[0]);
                            this.giveCard(cards[0], rumour.playerWhoAnswered)
                        }
                        this.rumours[i] = rumour;
                    }
                }
                return isUpdated;
            },
            processLogic() {
                let isUpdated = true;
                while (isUpdated) {
                    console.log('Processing logic');
                    isUpdated = this.processPlayers();
                    if (this.processCards()) isUpdated = true;
                    if (this.processRumours()) isUpdated = true;
                }
            },
            ackDontHave(rumour) {
                let who = this.getCard(rumour.cards[0]);
                let what = this.getCard(rumour.cards[1]);
                let where = this.getCard(rumour.cards[2]);

                let index = rumour.playerPosition % this.numberOfPlayers; // Index of next player after player who rumoured
                while ((rumour.playerWhoAnswered > 0 && index !== rumour.playerWhoAnswered - 1) || (
                    rumour.playerWhoAnswered <= -1 && index !== rumour.playerPosition - 1)) {
                    who.players[index].value = '/';
                    what.players[index].value = '/';
                    where.players[index].value = '/';
                    index = (index + 1) % this.numberOfPlayers;
                }

                this.setCard(rumour.cards[0], who);
                this.setCard(rumour.cards[1], what);
                this.setCard(rumour.cards[2], where);

                this.processLogic();
            },
            /**
             * Adds a rumour with the active who, what and where.
             * Calls processLogic.
             */
            addRumour(rumour) {
                rumour.playerPosition = this.activePlayerPosition;
                rumour.id = this.nextId++;
                rumour.isFinished = rumour.playerWhoAnswered === -1;
                this.rumours.splice(0, 0, rumour); // Add rumour to the start of the list
                this.ackDontHave(rumour);
            },
            /**
             * Proceed to assign the player the card if it's not already found.
             * Call processLogic.
             * @param event an object containing a card and a player position
             */
            assignCard(event) {
                if (event.card.isFound || event.card.isTheOne) {
                    console.log('Card ' + event.card.name + ' is already found');
                } else {
                    if (event.playerPos !== 0) {
                        this.players[event.playerPos - 1].cards.push(event.card);
                    }
                    this.giveCard(event.card, event.playerPos);
                    this.processLogic();
                }
            },
            /**
             * Actually finishes the row for the given card, assigning it to a player.
             * @param card this card to be assigned
             * @param playerPos the player's position
             */
            giveCard(card, playerPos) {
                let players = [];
                for (let pos = 1; pos <= this.numberOfPlayers; pos++) {
                    players[pos - 1] = {value: '/', pos: pos};
                }
                if (playerPos !== 0) {
                    players[playerPos - 1].value = 'O';
                }
                for (let i = 0; i < this.table.who.length; i++) {
                    if (this.table.who[i].id === card.id) {
                        this.table.who[i].isFound = true;
                        this.table.who[i].players = players;
                    }
                }
                for (let i = 0; i < this.table.what.length; i++) {
                    if (this.table.what[i].id === card.id) {
                        this.table.what[i].isFound = true;
                        this.table.what[i].players = players;
                    }
                }
                for (let i = 0; i < this.table.where.length; i++) {
                    if (this.table.where[i].id === card.id) {
                        this.table.where[i].isFound = true;
                        this.table.where[i].players = players;
                    }
                }
            },
            /**
             * Moves to the next player's turn.
             */
            nextPlayer() {
                this.isBtnActive = false;
                this.activePlayerPosition++;
                if (this.activePlayerPosition > this.numberOfPlayers) {
                    this.activePlayerPosition = 1;
                }
                this.activePlayerName = this.players[this.activePlayerPosition - 1].name;
                setTimeout(() => {
                    this.isBtnActive = true;
                }, 1000);
            },
            /**
             * Adds a player to the game, with no cards, no name, and the next unused character.
             */
            addPlayer() {
                let character = this.freeCharacter();
                this.players.push({
                    name: '',
                    position: this.nextPosition,
                    isMe: false,
                    character: character,
                    cards: []
                });
                this.nextPosition++;
                this.numberOfPlayers++;
            },
            /**
             * Removes the player with the given position and updates other player's positions.
             * @param position the index plus one of the player to be removed
             */
            removePlayer(position) {
                for (let i = position - 1; i < this.players.length; i++) {
                    this.players[i].position--;
                }
                this.players.splice(position - 1, 1);
                this.nextPosition--;
                this.numberOfPlayers--;
            },
            /**
             * Returns the name and colour of the next unused character.
             * @returns name: String, colour: String the name and colour of the next character,
             * or {name: 'No characters left', colour: 'No characters left'}
             */
            freeCharacter() {
                let character;
                let player;
                let taken;
                for (let i = 0; i < characters.length; i++) {
                    character = characters[i].value;
                    taken = false;
                    for (let j = 0; j < this.players.length; j++) {
                        player = this.players[j];
                        if (player.character.name === character.name) {
                            taken = true;
                            break;
                        }
                    }
                    if (!taken) {
                        return character;
                    }
                }
                character = {name: 'No characters left', colour: 'No characters left'};
                return character;
            },
            /**
             * Checks if the players have valid characters and no double up characters.
             * @return {boolean} true if valid, otherwise false
             */
            validatePlayers() {
                let checkList = characters;
                for (let i = 0; i < checkList.length; i++) {
                    checkList[i].count = 0;
                    for (let j = 0; j < this.players.length; j++) {
                        if (checkList[i].value.name === this.players[j].character.name) {
                            checkList[i].count += 1;
                        }
                    }
                    if (checkList[i].count > 1) {
                        return false;
                    }
                }
                return true;
            },
            /**
             * Init the cards into a list with the proper starting fields.
             * @param cardTypes the type of cards being init, who (characters), what (weapons), where (rooms)
             * @return Array the list of cards
             */
            setUpCards(cardTypes) {
                let cards = [], card;
                for (let i = 0; i < cardTypes.length; i++) {
                    card = {
                        name: cardTypes[i].value.name,
                        id: this.nextId,
                        isTheOne: false,
                        isFound: false,
                        players: []
                    };
                    for (let pos = 1; pos <= this.numberOfPlayers; pos++) {
                        card.players[pos - 1] = {value: ' ', pos: pos};
                    }
                    cards.push(card);
                    this.nextId++;
                }
                return cards;
            },
            /**
             * Init for the start of the game. Validates players and init cards.
             */
            setUp() {
                if (!this.validatePlayers()) {
                    return;
                }
                this.isSetUp = true;
                this.table.who = this.setUpCards(this.characters);
                this.table.what = this.setUpCards(this.weapons);
                this.table.where = this.setUpCards(this.rooms);
                this.nextPlayer();
            },
        }
    }
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 20px;
    }
</style>
