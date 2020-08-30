<template>
  <v-card max-width="600" class="mx-auto elevation-12">
    <v-toolbar color="primary light" dark dense>
      <v-toolbar-title>Quiz Introduction</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form>
        <v-select
          v-model="form.categories"
          :items="categories"
          item-text="name"
          item-value="id"
          label="Categories"
          multiple
          outlined
        ></v-select>
        <h2>Filter questions by:</h2>
        <v-row>
          <v-col cols="auto">
            <v-switch v-model="form.is_checked" class="ma-2" label="Consultant checked"></v-switch>
          </v-col>
          <v-col cols="auto">
            <v-switch v-model="form.is_author" class="ma-2" label="Created by me"></v-switch>
          </v-col>
          <v-col cols="auto">
            <v-switch v-model="form.is_answered_wrong" class="ma-2" label="Answered incorrectly"></v-switch>
          </v-col>
          <v-col cols="auto">
            <v-switch v-model="form.is_not_answered" class="ma-2" label="Not answered yet"></v-switch>
          </v-col>
        </v-row>
        <v-slider
          v-if="this.filtered_questions.length"
          v-model="form.question_limit"
          :value="this.filtered_questions.length"
          :max="this.filtered_questions.length"
          :hint="this.filtered_questions.length + ' available'"
          label="How many?"
          persistent-hint
          :thumb-size="20"
          thumb-label="always"
        ></v-slider>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn
        block
        large
        color="primary"
        @click="submit"
        :disabled="this.filtered_questions.slice(0, this.form.question_limit).length == 0"
      >Start</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Category from "@/apis/Category";
import Question from "@/apis/Question";
import User from "@/apis/User";
import { mapState } from "vuex";
export default {
  name: "QuizSetup",
  data() {
    return {
      categories: [],
      questions: [],
      filtered_questions: [],
      questions_answered_wrong: [],
      unanswered_questions: [],
      form: {
        categories: [],
        is_checked: 0,
        is_answered: 0,
        is_author: 0,
        is_not_answered: 0,
        question_limit: 0
      }
    };
  },
  computed: {
    ...mapState(["user"])
  },
  methods: {
    submit() {
      this.$store.dispatch(
        "setQuestions",
        this.filtered_questions.slice(0, this.form.question_limit)
      );
      this.$router.push({ name: "QuizStart" });
    }
  },
  watch: {
    form: {
      handler() {
        this.filtered_questions = this.questions
          .filter(el => {
            return this.form.categories.length
              ? this.form.categories.includes(el.category.id)
              : true;
          })
          .filter(el => {
            return this.form.is_checked
              ? el.is_checked == this.form.is_checked
              : true;
          })
          .filter(el => {
            return this.form.is_author ? el.user_id == this.user.id : true;
          })
          .filter(el => {
            return this.form.is_answered_wrong
              ? this.questions_answered_wrong.includes(el.id)
              : true;
          })
          .filter(el => {
            return this.form.is_not_answered
              ? this.unanswered_questions.includes(el.id)
              : true;
          });
      },
      deep: true
    }
  },
  mounted() {
    Category.all().then(response => {
      this.categories = response.data.data;
    });
    Question.all().then(response => {
      this.filtered_questions = response.data.data;
      this.questions = response.data.data;
    });
    User.profile(this.user.id).then(response => {
      this.questions_answered_wrong =
        response.data.data.questions_answered_wrong;
      this.unanswered_questions = response.data.data.unanswered_questions;
    });
  },
  beforeCreate() {
    this.$store.dispatch("removeQuestions");
    this.$store.dispatch("removeResponses");
  }
};
</script>
