<template>
  <head>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
    />
  </head>
  <body>
    <div class="p-4" style="color: rgb(255, 255, 255); width: 200px">
      <button class="btn bg-input-bg">Create a category</button>
    </div>
  </body>
</template>

<script setup lang="ts">
import { addRecord } from "./dbServices";

const supabase = useSupabaseClient();
</script>
