# Hi there 👋, I'm Shavrka

<div align="center">

![GitHub Stats](./profile/stats.svg)

![GitHub Streak](./profile/streak.svg)

![Top Languages](./profile/langs.svg)

</div>

---

## 🛠 Upute: Kako uključiti privatne repozitorije u svoju statistiku

Ako radite na privatnim repozitorijima i želite da se ti doprinosi (commitovi) prikažu na vašim statističkim karticama (poput broja commitova, streak-a, jezika koje koristite), potrebno je podesiti **Personal Access Token (PAT)** i omogućiti prikazivanje privatnih doprinosa na vašem profilu.

### Korak 1: Omogućavanje privatnih doprinosa na GitHub profilu
Da bi se vaši privatni commitovi uopšte računali u vašem *Contribution* grafu na GitHubu, potrebno je to uključiti u postavkama profila:
1. Otvorite svoj **GitHub profil** (`https://github.com/vaše_korisničko_ime`).
2. Dođite do vašeg zelenog grafa doprinosa (*Contribution graph*).
3. U gornjem desnom uglu iznad samog grafa, kliknite na **"Contribution settings"** (padajući meni).
4. Označite opciju **"Private contributions"**. (Ovo će dodati vaše commitove iz privatnih repozitorija u grafikon, ali bez otkrivanja naziva tih repozitorija drugim ljudima).

### Korak 2: Kreiranje Personal Access Tokena (PAT)
Da bi ova skripta mogla pročitati podatke iz vaših privatnih repozitorija (kako bi napravila tačne SVG statistike), potreban joj je pristup preko tokena.
1. Idite u gornji desni ugao na GitHubu (vaša profilna slika) i kliknite **Settings**.
2. Na dnu lijeve bočne trake kliknite na **Developer settings**.
3. Zatim idite na **Personal access tokens** -> **Tokens (classic)**.
4. Kliknite na dugme **Generate new token (classic)**.
5. U polje **Note** upišite šta god želite (npr. `PAT_STATS`).
6. Pod opcijom **Expiration**, preporučuje se staviti `No expiration` (ili određeni duži period, ali morat ćete ga obnoviti kad istekne).
7. U sekciji **Select scopes**, obavezno označite:
   - **`repo`** (ovo omogućava pristup i javnim i privatnim repozitorijima).
   - **`read:user`** i **`user:email`** (ispod sekcije `user`, za dohvaćanje korisničkih podataka).
8. Skenirajte do dna stranice i kliknite **Generate token**.
9. **Odmah kopirajte generisani token** jer ga više nećete moći vidjeti nakon zatvaranja prozora!

### Korak 3: Postavljanje tokena u repozitorij (Repository Secrets)
Sada taj token morate dodati u ovaj repozitorij kako bi ga GitHub Action skripta mogla koristiti.
1. Otvorite ovaj repozitorij na GitHubu.
2. Kliknite na karticu **Settings** (odnosi se na postavke repozitorija).
3. Na lijevoj strani u meniju idite na **Secrets and variables** -> **Actions**.
4. Kliknite na zeleno dugme **New repository secret**.
5. U polje **Name** morate upisati tačno sljedeće: `PAT_STATS` (ovako je definirano u `.github/workflows/update-stats.yml` datoteci).
6. U polje **Secret** zalijepite vaš kopirani token iz prethodnog koraka.
7. Kliknite **Add secret**.

### Korak 4: Testiranje (Pokretanje GitHub Akcije)
Nakon što ste dodali secret, možete ručno pokrenuti akciju da generišete novu statistiku.
1. U ovom repozitoriju, kliknite na karticu **Actions**.
2. Na lijevoj strani izaberite vaš workflow (npr. **Update GitHub Stats Cards**).
3. S desne strane kliknite na padajući meni **Run workflow**.
4. Potvrdite klikom na zeleno dugme **Run workflow**.

Kada se akcija završi uspješno (pokazat će zelenu kvačicu), vaše kartice (`stats.svg`, `streak.svg`, `langs.svg`) će biti automatski ažurirane i uključivat će vašu privatnu statistiku!