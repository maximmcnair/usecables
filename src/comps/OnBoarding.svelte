<script lang="ts">
  let show = false;
  let slide = 1;

  /*

- Welcome to cables
- Right click to create node
- Drag connectors to connect nodes
- Navigate nodes with scroll and zoom

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
          <div class="slide__content">
            <h3>Create nodes with right click</h3>
            <h4>Pick node type from drop down selection</h4>
            <button on:click={() => nextSlide()}>Next</button>
          </div>
        </div>
      {/if}
      {#if slide === 3}
        <div class="slide">
          <div class="slide__content">
            <h3>Connect nodes by dragging connections</h3>
            <h4>Data flows between nodes. Make connections to direct the flow of the data.</h4>
            <button on:click={() => nextSlide()}>Next</button>
          </div>
        </div>
      {/if}
      {#if slide === 4}
        <div class="slide">
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
    z-index: 9999;
    justify-content: center;
    align-items: center;
    background: rgba(13, 13, 13, 0.002);
    backdrop-filter: blur(1px);
  }
  .content {
    background: var(--color-black);
    width: 400px;
    height: 400px;
    margin-top: -50px;
    border: 1px solid var(--color-grey);
    border-radius: 5px;
    text-align: center;
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

  .slide__content {
    padding: 20px;
  }
</style>
