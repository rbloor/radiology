<template>
  <v-dialog v-model="dialog" max-width="600px" persistent @input="open">
    <template v-slot:activator="{ on }">
      <v-btn class="ml-2 primary" fab x-small dark v-on="on">
        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-form>
        <v-card-title class="pt-4 headline">Edit answer</v-card-title>
        <v-card-text>
          <v-text-field v-model="form.name" label="Name" :error-messages="errors.name"></v-text-field>
          <v-textarea v-model="form.notes" label="Notes" :error-messages="errors.notes" auto-grow></v-textarea>
          <v-switch v-model="form.is_correct" label="Correct?" class="ma-2"></v-switch>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="close">Close</v-btn>
          <v-btn text color="primary" @click="submit">Save</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "EditAnswerModal",
  props: {
    item: {
      type: [Object],
      required: true
    }
  },
  data() {
    return {
      dialog: false,
      errors: [],
      form: {
        name: "",
        notes: "",
        is_correct: ""
      },
      default: {
        name: "",
        notes: "",
        is_correct: ""
      }
    };
  },
  methods: {
    open() {
      this.form = Object.assign({}, this.item);
    },
    close() {
      this.dialog = false;
      this.errors = [];
      this.form = Object.assign({}, this.default);
    },
    submit() {
      this.$emit("edit:item", this.form);
      this.close();
    }
  }
};
</script>
