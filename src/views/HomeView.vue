<template>
    <div class="home-view">
        <h2>Pool Standings</h2>
        <!--
        <div class="debug-control">
            <button @click="refreshMatches">Refresh matches</button>
        </div>
        -->
        <PoolStandings />
    </div>
</template>

<script setup>
import PoolStandings from '@/components/PoolStandings.vue'
// import { clearMatchesCache } from '@/utils/fetchMatches.js'

// const refreshMatches = async () => {
//     clearMatchesCache()
//     window.location.reload()
// }
</script>

<style scoped>
.home-view {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

h2 {
    margin-bottom: 1rem;
}
</style>
