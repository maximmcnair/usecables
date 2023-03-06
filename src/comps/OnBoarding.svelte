<script lang="ts">
  let show = true;
  let slide = 1;

  /*

- Welcome to cables
- Right click to create node
- Drag connectors to connect nodes
- Navigate nodes with scroll and zoom
http://localhost:5173/
  */

  function hideOnBoarding() { show = false }

  function nextSlide () {
    slide = slide + 1;
  }
</script>

{#if show}
  <section class="onboarding">
    <div class="content">
      {#if slide === 1}
        <div class="slide">
          <img class="slide__img" src="/cables-onboarding-1.png" />
          <div class="slide__content">
            <h2>Welcome to Cables</h2>
            <h4>Cables is a non-code animation tool.</h4>
            <h4>We're currently in closed alpha but you can play with the tool without saving.</h4>
            <button on:click={() => nextSlide()}>Next</button>
          </div>
        </div>
      {/if}
      {#if slide === 2}
        <div class="slide">
          <img class="slide__img" src="/cables-onboarding-4.png" />
          <div class="slide__content">
            <h3>Create nodes with right click</h3>
            <h4>Pick node type from drop down selection</h4>
            <button on:click={() => nextSlide()}>Next</button>
          </div>
        </div>
      {/if}
      {#if slide === 3}
        <div class="slide">
          <img class="slide__img" src="/cables-onboarding-3.png" />
          <div class="slide__content">
            <h3>Connect nodes by dragging connections</h3>
            <h4>Data flows between nodes. Make connections to direct the flow of the data.</h4>
            <button on:click={() => nextSlide()}>Next</button>
          </div>
        </div>
      {/if}
      {#if slide === 4}
        <div class="slide">
          <img class="slide__img" src="/cables-onboarding-2.png" />
          <div class="slide__content">
            <h3>Delete nodes</h3>
            <h4>Right click on a node to delete it</h4>
            <button on:click={() => hideOnBoarding()}>Done</button>
          </div>
        </div>
      {/if}
    </div>
  </section>
{/if}

<style>
  .onboarding {
    position: fixed;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    background: rgba(13, 13, 13, 0.6);
    backdrop-filter: blur(1px);
  }
  .content {
    background: var(--color-black);
    width: 500px;
    height: 640px;
    margin-top: -50px;
    border: 1px solid var(--color-grey);
    border-radius: 5px;
    text-align: center;
    overflow: hidden;
  }

  h2 {
    font-size: 38px;
    font-weight: 600;
    margin: 0px;
  }
  h3 {
    font-size: 30px;
    font-weight: 600;
    margin: 0px;
  }
  h4 {
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
    margin: 0px;
    margin-top: 10px;
    margin-bottom: 10px;
    color: var(--color-grey-light);
  }

  .slide__img {
    height: 400px;
  }
  .slide__content {
    padding: 10px 20px;
  }
</style>
