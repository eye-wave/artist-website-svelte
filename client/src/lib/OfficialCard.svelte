<script lang="ts">
  import Icon from "./Icon.svelte"
  
  export let id: number
  export let artists: string[]
  export let title: string
  export let link: {
      soundcloud: string
      youtube: string
      spotify: string
  }
  export let image: string
  export let timestamp: number

  const linkIcons =[
    {
      id: link.youtube,
      href: `https://youtu.be/${link.youtube}`,
      icon: "fe:youtube",
    },
    {
      id: link.soundcloud,
      href: `https://soundcloud.com/${link.soundcloud}`,
      icon: "grommet-icons:soundcloud",
    },
    {
      id: link.spotify,
      href: `https://open.spotify.com/track/${link.spotify}`,
      icon: "mdi:spotify",
    },
  ].filter(link => link.id)

</script>

<figure>
  <img src="http://localhost:3000/storage/file/{image}" alt=""/>

    <figcaption> { title } </figcaption>
    <div class="card-icons">
      {#each linkIcons as {href,icon}}
        <a {href} target="_blank">
          <Icon outlineColor="#000" {icon} />
        </a>
      {/each}
    </div>
  </figure>

<style lang="postcss">
  figure {
    @apply w-96 h-96 relative;
    @apply bg-cover text-white;
    @apply rounded-md shadow-md;
    overflow: hidden;
    user-select: none
  }

  .card-icons {
    @apply absolute bottom-0 px-3 py-2;
    @apply text-3xl;
    @apply flex gap-1;
    @apply text-primary-500
  }

  img {
    @apply w-full h-full inset-0 absolute;
    @apply bg-cover bg-center;
    z-index: 0;
    filter: blur(3px) brightness(60%);
    transition: filter 120ms ease-out;
  }

  figure:hover img {
    filter: blur(0) brightness(100%);  
  }

  figcaption {
    @apply relative p-2;
    @apply text-2xl text-center;
    text-shadow: 2px 2px 10px #000;
  }


  @media (hover: none) {
    img {
      filter: blur(0) brightness(100%);
    }
  }
</style>