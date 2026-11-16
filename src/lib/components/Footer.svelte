<script lang="ts">
  import { onMount } from "svelte";
  import { SITE } from "$lib/site";

  // Local time, with seconds. Set the zone and place in $lib/site.
  let localTime = "";

  onMount(() => {
    const updateTime = () => {
      localTime = new Date().toLocaleTimeString("en-US", {
        timeZone: SITE.timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  });

  const buildDate = new Date(__BUILD_DATE__)
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toLowerCase();
</script>

<footer class="page-shell-standard w-full mt-4 pb-8">
  <div class="pt-6">
    <div
      class="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-y-4"
    >
      <div class="space-y-1 text-center font-ui text-xs lowercase text-ink-500 dark:text-cream-500 sm:text-left">
        <div class="tabular-nums">{localTime.toLowerCase()}</div>
        <div>{SITE.location}</div>
      </div>

      <div class="font-ui text-xs lowercase text-ink-500 dark:text-cream-500">
        updated {buildDate}
      </div>
    </div>
  </div>
</footer>
