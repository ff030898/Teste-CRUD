<template>
    <div id="app">
        <v-app id="inspire">
            <!-- Toolbar -->
            <toolbar></toolbar>

            <div class="pa-4">

                <p style="text-align: left;"><b>Funcionário: </b> {{ username }}<a href="#" @click="logout" class="mx-2">sair</a></p>

                <v-alert :value="openAlert" :type=type>
                    {{ textAlert }}
                </v-alert>

                <v-toolbar flat color="white">
                    <v-toolbar-title>{{ mounth }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on }">
                            <v-btn v-show="enabled" color="primary" dark class="mb-2"
                                @click="createAssignment()">Registrar
                                ponto</v-btn>
                        </template>



                        <v-dialog v-model="loading" hide-overlay persistent width="300">
                            <v-card color="primary" dark>
                                <v-card-text>
                                    Aguarde...
                                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                                </v-card-text>
                            </v-card>
                        </v-dialog>


                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout wrap>
                                        <v-flex xs12 sm6 md4 v-if="editedItem.open !== 0">
                                            <v-text-field v-model="editedItem.open" label="Hora de entrada"
                                                type="time"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6 md4 v-if="editedItem.interval1 !== 0">
                                            <v-text-field v-model="editedItem.interval1" label="Início almoço"
                                                type="time"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6 md4 v-if="editedItem.interval2 !== 0">
                                            <v-text-field v-model="editedItem.interval2" label="Término almoço"
                                                type="time"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6 md4 v-if="editedItem.exit !== 0">
                                            <v-text-field v-model="editedItem.exit" label="Hora de saída"
                                                type="time"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="red darken-1" flat @click="close">Cancelar</v-btn>
                                <v-btn color="blue darken-1" flat @click="save">Salvar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
                <v-data-table :headers="headers" :items="assignments" class="elevation-1" hide-actions>

                    <template v-slot:items="props">
                        <td style="text-align: left;">{{ props.item.day }}</td>
                        <td style="text-align: left;">{{ props.item.open ? props.item.open : '-' }}</td>
                        <td style="text-align: left;">{{ props.item.interval1 ? props.item.interval1 : '-' }}</td>
                        <td style="text-align: left;">{{ props.item.interval2 ? props.item.interval2 : '-' }}</td>
                        <td style="text-align: left;">{{ props.item.exit ? props.item.exit : '-' }}</td>
                        <td style="text-align: left;">
                            <div v-if="props.item.open !== 0">
                                <v-icon small color="amber darken-1" class="mr-2" @click="editItem(props.item)">
                                    edit
                                </v-icon>

                                <v-icon small color="red darken-4" @click="deleteItem(props.item)">
                                    delete
                                </v-icon>
                            </div>
                        </td>
                    </template>

                </v-data-table>
            </div>

            <v-alert :value="false" type="success">
                Marcação inserida com sucesso.
            </v-alert>

        </v-app>
    </div>
</template>

<script>
import api from '../service/api';
import Toolbar from '../components/Toolbar';
import Vue from 'vue'
import VueRouter from 'vue-router';

export default {
    name: 'app',
    components: { Toolbar },
    data: () => {
        return {
            type: 'warning',
            textAlert: '',
            enabled: false,
            today: 0,
            username: '',
            openAlert: false,
            dialog: false,
            loading: false,
            headers: [
                {
                    text: 'Dia(s)',
                    sortable: false,
                    value: 'name'
                },
                { text: 'Hora de entrada', value: 'calories', sortable: false },
                { text: 'Início do Almoço', value: 'fat', sortable: false },
                { text: 'Término do almoço', value: 'carbs', sortable: false },
                { text: 'Hora de saida', value: 'protein', sortable: false },
                { text: 'Ações', value: 'name', sortable: false, }
            ],
            pagination: {
                sortBy: 'name'
            },
            assignments: [],
            editedIndex: -1,
            api,
            editedItem: {
                open: '',
                interval1: '',
                interval1: '',
                exit: '',
            },
            defaultItem: {
                open: '',
                interval1: '',
                interval1: '',
                exit: '',
            }
        }
    },

    mounted() {
        if (localStorage.username) {
            this.username = localStorage.getItem('username')
        }else {
            this.$router.push('/');
        }

    },

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Novo registro' : 'Editar registro'
        }
    },

    watch: {
        dialog(val) {
            val || this.close()
        },

    },

    created() {
        this.initialize()
    },


    methods: {

        logout () {
            localStorage.removeItem('username')
            this.$router.push('/');
        },
        async initialize() {

            this.username = localStorage.getItem('username')

            this.loading = true;

            var date = new Date();
            var mes = ''
            this.today = ('0' + date.getDate()).slice(-2);

            switch (date.getMonth()) { //converte o numero em nome do mês
                case 0:
                    mes = "Janeiro";
                    break;
                case 1:
                    mes = "Fevereiro";
                    break;
                case 2:
                    mes = "Março";
                    break;
                case 3:
                    mes = "Abril";
                    break;
                case 4:
                    mes = "Maio";
                    break;
                case 5:
                    mes = "Junho";
                    break;
                case 6:
                    mes = "Julho";
                    break;
                case 7:
                    mes = "Agosto";
                    break;
                case 8:
                    mes = "Setembro";
                    break;
                case 9:
                    mes = "Outubro";
                    break;
                case 10:
                    mes = "Novembro";
                    break;
                case 11:
                    mes = "Dezembro";
                    break;
            }

            this.mounth = mes + ' de ' + date.getFullYear()

            await api.get('assignments', {
                headers: {
                    username: this.username,

                }
            }).then(response => {
                this.assignments = response.data

            })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => this.loading = false)

            this.loading = false;
            this.enabled = true;







        },

        async createAssignment() {

            const dateSearch = this.today;

            const assignmentsToday = this.assignments.filter(function (item) {
                return item.day === dateSearch;
            });

            if (assignmentsToday[0].idOpen !== 0 && assignmentsToday[0].idInterval1 !== 0 && assignmentsToday[0].idInterval2 && assignmentsToday[0].idExit !== 0) {
                this.type = 'warning';
                this.openAlert = true;
                this.textAlert = 'Já foram inseridas as 4 marcações diárias!'
                setTimeout(() => {
                    this.openAlert = false;
                }, 5000)

            } else {
                this.loading = true;
                await api.post('/assignments', {
                    username: this.username,

                }).then(function (response) {

                    // this.openAlert = true;
                })
                    .catch(function (error) {
                        // this.openAlert = false;
                        console.log(error)
                    });


                this.loading = false;

                this.type = 'success';
                this.openAlert = true;
                this.textAlert = 'Marcação registrada com sucesso'

                setTimeout(() => {
                    this.openAlert = false;
                    window.location.reload();
                }, 1500)

            }


        },
        editItem(item) {
            if (item.open !== null) {
                this.editedIndex = this.assignments.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            }

        },

        async deleteItem(item) {
            if (item.open !== null) {
                const index = this.assignments.indexOf(item)

                if (confirm('Atenção. Só é permitido excluir a ultima marcação. Tem certeza que deseja excluir o ultimo registro ?') == true) {

                    this.loading = true;

                    if (item.idExit !== 0) {
                        await api.post(`/assignments/${item.idExit}`)
                    } else if (item.idInterval2 !== 0) {
                        await api.post(`/assignments/${item.idInterval2}`)
                    } else if (item.idInterval1 !== 0) {
                        await api.post(`/assignments/${item.idInterval1}`);
                    } else if (item.idOpen !== 0) {
                        await api.post(`/assignments/${item.idOpen}`)
                    }

                    this.loading = false;

                    this.type = 'success';
                    this.openAlert = true;
                    this.textAlert = 'Marcação removida com sucesso'

                    setTimeout(() => {
                        this.openAlert = false;
                        window.location.reload();
                    }, 1500)


                }

            }

        },

        close() {
            this.dialog = false
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            }, 300)
        },

        async save() {
            if (this.editedIndex > -1) {

                this.loading = true;

                if (this.editedItem.idOpen !== 0) {
                    await api.put(`/assignments/${this.editedItem.idOpen}`, {
                        time: this.editedItem.open,

                    })
                }

                if (this.editedItem.idInterval1 !== 0) {
                    await api.put(`/assignments/${this.editedItem.idInterval1}`, {
                        time: this.editedItem.interval1,

                    });
                }

                if (this.editedItem.idInterval2 !== 0) {
                    await api.put(`/assignments/${this.editedItem.idInterval2}`, {
                        time: this.editedItem.interval2,

                    })
                }

                if (this.editedItem.idExit !== 0) {
                    await api.put(`/assignments/${this.editedItem.idExit}`, {
                        time: this.editedItem.exit,

                    })
                }

                this.loading = false;

                this.type = 'success';
                this.openAlert = true;
                this.textAlert = 'Marcações atualizadas com sucesso'

                setTimeout(() => {
                    this.openAlert = false;
                    window.location.reload();
                }, 1500)



            }
            this.close()
        },
    }
}
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>