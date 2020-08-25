<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <div class="card">
      <div class="card-body" v-if="user">
        <h3 class="mb-3">Hello, {{ user.name }}</h3>
        <v-row>
          <v-col lg="3" md="4" cols="sm" class="pb-2">
            <v-card class="mx-auto" color="primary" dark>
              <v-card-title left>
                <span class="title font-weight-light">Unanswered Questions</span>
              </v-card-title>
              <v-card-text right class="headline font-weight-bold">{{ unansweredQuestions }}</v-card-text>
            </v-card>
          </v-col>
          <v-col lg="3" md="4" cols="sm" class="pb-2">
            <v-card class="mx-auto" color="primary" dark>
              <v-card-title left>
                <span class="title font-weight-light">Questions Answered</span>
              </v-card-title>
              <v-card-text right class="headline font-weight-bold">{{ answered }}</v-card-text>
            </v-card>
          </v-col>
          <v-col lg="3" md="4" cols="sm" class="pb-2">
            <v-card class="mx-auto" color="green" dark>
              <v-card-title left>
                <span class="title font-weight-light">Answered Correctly</span>
              </v-card-title>
              <v-card-text right class="headline font-weight-bold">{{ correct }}</v-card-text>
            </v-card>
          </v-col>
          <v-col lg="3" md="4" cols="sm" class="pb-2">
            <v-card class="mx-auto" color="red" dark>
              <v-card-title left>
                <span class="title font-weight-light">Answered Incorrectly</span>
              </v-card-title>
              <v-card-text right class="headline font-weight-bold">{{ wrong }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col lg="12" cols="sm" class="pb-2">
            <v-simple-table class="mt-4" :light="true">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th class="text-center">Total</th>
                  <th class="text-center">Correct</th>
                  <th class="text-center">Incorrect</th>
                  <th class="text-center">Percentage</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(group, category) in submissionsGroupByCategory" :key="category">
                  <td>{{ group[0].category.name }}</td>
                  <td class="text-center">{{ group.length }}</td>
                  <td class="text-center">{{ filterCorrect(group) }}</td>
                  <td class="text-center">{{ filterWrong(group) }}</td>
                  <td
                    class="text-center"
                  >{{ Math.round((filterCorrect(group) / group.length)*100) }}%</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import User from "@/apis/User";
import { mapState } from "vuex";
export default {
  data() {
    return {
      profile: null,
      answered: 0,
      correct: 0,
      wrong: 0,
      submissionsGroupByCategory: null,
      unansweredQuestions: 0
    };
  },
  methods: {
    filterCorrect(array) {
      return array.filter(elem => {
        return elem.is_correct;
      }).length;
    },
    filterWrong(array) {
      return array.filter(elem => {
        return !elem.is_correct;
      }).length;
    }
  },
  computed: {
    ...mapState(["user"])
  },
  created() {
    User.profile(this.user.id).then(response => {
      this.profile = response.data.data;
      this.answered = this.profile.submissions.length;
      this.unansweredQuestions = this.profile.unanswered_questions.length;
      this.correct = this.filterCorrect(this.profile.submissions);
      this.wrong = this.filterWrong(this.profile.submissions);
      this.submissionsGroupByCategory = this.profile.submissions.reduce(
        (result, currentValue) => {
          result[currentValue.category.name] = [
            ...(result[currentValue.category.name] || []),
            currentValue
          ];
          return result;
        },
        {}
      );
    });
  }
};
</script>
