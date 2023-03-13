<script lang="ts">
  import { group } from "d3";
import OfficialCard from "src/lib/OfficialCard.svelte"
  import type { ReleaseEntry } from "./+page";
  export let data

  const { releases } =data

  type Group ={
    year: number,
    items: ReleaseEntry[]
  }
  const groupedByYear:Group[] =[]
  
  releases.forEach(r => {
    const date =new Date(r.timestamp *1000)
    const year =date.getFullYear()
    // const formater =new Intl.DateTimeFormat("en-GB",{ dateStyle: "medium" })
    // const formated =formater.format(date)

    let [ group ] =groupedByYear.filter(g => g.year === year)
    if ( !group ) {
      group ={ year, items: [r] }
      groupedByYear.push( group )
      return
    }

    group.items.push(r)
  })

  console.log(groupedByYear)

</script>

<main>
  {#each groupedByYear as group}
    <section class="py-40">
      <h2 class="text-3xl text-center font-bold my-10 text-primary-300">{ group.year }</h2>
      <ul class="flex flex-wrap gap-10 justify-center px-10">
        {#each group.items as release}
          <OfficialCard {...release} />
        {/each}
      </ul>
    </section>
  {/each}
</main>
