<template>
  <v-card max-width="600" class="mx-auto elevation-12">
    <v-toolbar color="primary" dark flat dense>
      <v-toolbar-title>Quiz Results</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6">
          <DoughnutChart :data="[correct, wrong]"></DoughnutChart>
        </v-col>
        <v-col cols="12" sm="6">
          <h2 class="mt-4 mb-4 text-center text-sm-left">You got {{ correct }} out of {{ total }}</h2>
          <h2 class="display-1 mb-4 text-center text-sm-left">{{ percentage }}%</h2>
        </v-col>
      </v-row>
      <h2 class="h2">Overview</h2>
      <v-simple-table class="mt-4" :light="true">
        <tbody>
          <tr v-for="(group, category) in groups" :key="category">
            <td>
              <v-icon v-if="filterCorrect(group) == group.length" color="green">mdi-check</v-icon>
              <v-icon v-if="filterCorrect(group) != group.length" color="red">mdi-cancel</v-icon>
            </td>
            <td :class="getColorClass(group)">{{ group[0].question.category.name }}</td>
            <td :class="getColorClass(group)">{{ filterCorrect(group) + '/' + group.length }}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card-text>
    <v-card-actions>
      <v-btn class="ma-2 ml-auto" color="primary" @click="finish()">Finish</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
import DoughnutChart from "@/components/DoughnutChart";
import Submission from "@/apis/Submission";
export default {
  name: "QuizResults",
  components: {
    DoughnutChart
  },
  data() {
    return {
      errors: null
    };
  },
  computed: {
    ...mapState(["questions", "responses", "user"]),
    correct() {
      return this.filterCorrect(this.responses);
    },
    wrong() {
      return this.filterWrong(this.responses);
    },
    total() {
      return this.responses.length;
    },
    percentage() {
      return Math.round((this.correct / this.total) * 100);
    },
    groups() {
      return this.responses.reduce((result, currentValue) => {
        result[currentValue.question.category.id] = [
          ...(result[currentValue.question.category.id] || []),
          currentValue
        ];
        return result;
      }, {});
    }
  },
  methods: {
    filterCorrect(array) {
      return array.filter(elem => {
        return elem.outcome;
      }).length;
    },
    filterWrong(array) {
      return array.filter(elem => {
        return !elem.outcome;
      }).length;
    },
    getColorClass(array) {
      return this.filterCorrect(array) == array.length
        ? "green--text"
        : "red--text";
    },
    finish() {
      let data = this.responses.map(a => {
        return {
          user_id: this.user.id,
          question_id: a.question.id,
          is_correct: a.outcome
        };
      });
      Submission.createOrUpdate(data)
        .then(() => {
          this.$router.push({ name: "Dashboard" });
        })
        .catch(error => {
          if (error.response.status === 422) {
            this.errors = error.response.data.errors;
          }
        });
    }
  }
};
</script>
