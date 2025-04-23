<script setup>
const supabase = useSupabaseClient();

const { data, error } = await supabase.auth.getUser();
const displayUserName = data.user.user_metadata.fName;
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-5 p-8 gap-8">
    <div
      class="p-8 bg-white rounded-2xl col-span-2 flex flex-col items-center justify-center"
    >
      <h1 class="font-title text-xl uppercase font-bold">
        Welcome back, {{ displayUserName }}
      </h1>
    </div>

    <div
      class="p-8 bg-white rounded-2xl col-span-3 flex flex-col items-center justify-center"
    >
      <div class="flex flex-col items-end justify-center">
        <p
          class="text-primary-500 text-xl font-bold font-title uppercase text-center"
        >
          "Talent wins games, but teamwork <br />
          and intelligence win championships"
        </p>
        <p class="text-right text-primary-500">- Michael Jordan</p>
      </div>
    </div>

    <h1 class="col-span-5 text-xl font-title font-bold uppercase">
      Quick Links
    </h1>

    <a
      href="https://rackleyswimming.com.au/"
      target="_blank"
      class="p-8 bg-white rounded-2xl col-span-1 flex flex-col items-center justify-center cursor-pointer"
    >
      <img src="/assets/images/brand-1.svg" alt="Rackley Logo" />
    </a>

    <a
      href="https://www.citysport.com.au/"
      target="_blank"
      class="p-8 bg-white rounded-2xl col-span-1 flex flex-col items-center justify-center cursor-pointer"
    >
      <img src="/assets/images/brand-4.svg" alt="City Sport Logo" />
    </a>

    <a
      href="https://fishnflips.com/"
      target="_blank"
      class="p-8 bg-white rounded-2xl col-span-1 flex flex-col items-center justify-center cursor-pointer"
    >
      <img src="/assets/images/brand-5.svg" alt="Fish N Flips Logo" />
    </a>

    <a
      href="https://cityaquatics.com.au/"
      target="_blank"
      class="p-8 bg-white rounded-2xl col-span-1 flex flex-col items-center justify-center cursor-pointer"
    >
      <img src="/assets/images/brand-2.svg" alt="City Aquatics Logo" />
    </a>

    <a
      href="https://cityhealthclubs.com.au/"
      target="_blank"
      class="p-8 bg-white rounded-2xl col-span-1 flex flex-col items-center justify-center cursor-pointer"
    >
      <img src="/assets/images/brand-3.svg" alt="City Health Clubs Logo" />
    </a>

    <h1 class="col-span-5 text-xl font-title font-bold uppercase">
      CVM Leadership Fundamentals
    </h1>

    <div class="p-8 bg-white rounded-2xl col-span-5 flex gap-16">
      <div class="flex flex-col justify-start gap-2">
        <p>Customer Obsession</p>
        <p>Optimism</p>
        <p>High Performance Culture</p>
        <p>People Cultivation</p>
        <p>Empathy</p>
        <p>Growth Mindset</p>
        <p>Speed to Act</p>
        <p>Connected</p>
        <p>Ego Free</p>
        <p>Relationship Building</p>
        <p>Collaboration</p>
        <p>Frugality</p>
        <p>Ownership</p>
      </div>

      <div class="flex flex-col justify-start gap-2">
        <p>CVM Leaders put customers at the forefront of all decisions</p>
        <p>CVM Leaders believe in the future and people's potential</p>
        <p>
          CVM Leaders are always raising the bar through grit, resilience and
          discipline
        </p>
        <p>
          CVM Leaders create talent density through mentorship and development
        </p>
        <p>CVM Leaders lean in, listen and are always present</p>
        <p>
          CVM Leaders are innovative & tackle big bold ideas with courage and
          confidence
        </p>
        <p>
          CVM Leaders are proactive, have a bias for action, are mindful of
          risks but remain agile
        </p>
        <p>CVM Leaders dive deep into the detail</p>
        <p>
          CVM Leaders are calm under fire & lead by example, no task is beneath
          us
        </p>
        <p>
          CVM Leaders are vulnerable, authentic and transparent to earn trust
        </p>
        <p>CVM Leaders are candid, communicative & cohesive to prevent silos</p>
        <p>CVM Leaders achieve more with less, they are resourceful</p>
        <p>CVM Leaders have self-accountability and deliver results</p>
      </div>
    </div>

    <div class="col-span-5">
      <img
        src="../assets/images/team.jpg"
        alt="City Central Team"
        class="rounded-2xl"
      />
    </div>
  </div>
</template>
