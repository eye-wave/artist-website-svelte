<script lang="ts">
  import OfficialCard from "./OfficialCard.svelte"
  import type { ReleaseEntry } from "./+page.server";
  export let data

  const { releases } =data

  type Group ={
    year: number,
    oldestMonth: string,
    newestMonth: string,
    items: ReleaseEntry[]
  }
  
  const songGroups:Group[] =[]
  
  releases?.forEach(r => {
    const date =new Date(r.timestamp *1000)
    const year =date.getFullYear()

    let [ group ] =songGroups.filter(g => g.year === year)
    if ( !group ) {
      group ={ year, items: [r] } as Group
      songGroups.push( group )
      return
    }

    group.items.push(r)
  })

  const groupedByYear =songGroups.map(g => {
    const sorted =g.items.sort((a,b) => a.timestamp -b.timestamp)
    const oldest =Math.min(...sorted.map(s => s.timestamp))
    const newest =Math.max(...sorted.map(s => s.timestamp))

    const formater =new Intl.DateTimeFormat("en-GB",{ month: "long" })
    const oldestMonth =formater.format(oldest *1000)
    const newestMonth =formater.format(newest *1000)

    return { ...g, oldestMonth, newestMonth }
  })

</script>

<svelte:head>
  <title>Official Releases</title>
</svelte:head>

<main>
  {#each groupedByYear as group}
    <section class="py-40 text-center">
      <h2 class="text-3xl font-bold mt-10 text-primary-300">{ group.year }</h2>
      <h3 class="text-xs mb-10">
        {group.oldestMonth}{group.newestMonth !== group.oldestMonth ? ` - ${group.newestMonth}` : ""}
      </h3>

      <ul class="flex flex-wrap gap-10 justify-center px-10">
        {#each group.items as release}
          <OfficialCard {...release} />
        {/each}
      </ul>
    </section>
  {/each}
</main>
