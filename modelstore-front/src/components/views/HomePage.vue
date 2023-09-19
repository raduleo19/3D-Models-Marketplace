<template>
    <div class="bg-primary ">
        <div class="container-sm d-flex flex-md-row justify-content-center align-items-center flex-wrap flex-sm-column">
            <div class="hero-text mt-5">
                <h1 class="mb-4">Explorați lumea modelelor 3D de excepție în magazinul nostru online!</h1>
                <RouterLink class="btn btn-warning mt-4" to="/register">Creaza cont gratuit</RouterLink>
                <RouterLink class="btn btn-warning mt-4" to="/products">Descopera colectia</RouterLink>
            </div>

            <div>
                <img src="/images/hero.png" width="600" height="543" alt="hero" class="hero-img" />
            </div>
        </div>
    </div>

    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100">
        <path fill="#0d6efd" fill-opacity="1" d="M0, 0L1200,100L1440,0L0,0Z"></path>
    </svg>


    <div class="container-sm text-center">
        <h1>De ce sa ne alegi?</h1>

        <div class="d-flex section-info mt-4">
            <div class="info mb-5">
                <img class="info-img" width="300" height="300" src="/images/info.jpg" alt="info" />
                <h2 class="info-header mb-4 mt-2">Previzualizare</h2>
                <p class="info-text">Descoperiți în detaliu modelele 3D înainte de achiziție, utilizând funcționalitatea noastră avansată de previzualizare interactivă în 3D.</p>
            </div>
            <div class="info mb-5">
                <img class="info-img" width="300" height="300" src="/images/info2.jpg" alt="info" />
                <h2 class="info-header mb-4 mt-2">Calitate</h2>
                <p class="info-text">Calitatea superioară a modelelor noastre 3D vă aduce realism și detalii impresionante, transformând fiecare proiect într-o experiență vizuală captivantă.</p>
            </div>
            <div class="info">
                <img class="info-img" width="300" height="300" src="/images/info3.jpg" alt="info" />
                <h2 class="info-header mb-4 mt-2">Diversitate</h2>
                <p class="info-text">De la arhitectură la personaje fantastice și obiecte de design, oferim o varietate bogată de modele 3D, astfel încât să puteți găsi întotdeauna ceva potrivit pentru proiectele dvs. unice.</p>
            </div>
        </div>
    </div>
</template>

<style>
.hero-img {
    width: 100%;
    object-fit: cover;
}

.hero-text {
    max-width: 500px;
    margin-right: 20px;
    text-align: center;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.section-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    gap: 40px;
}

.info {
    max-width: 300px;
    text-align: center;
}

</style>
