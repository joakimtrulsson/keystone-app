# Keystone App

## Starta Projektet

För att starta projektet följ dessa steg:

1.  Klona projektet från GitHub-repot till din lokala maskin.

    ```bash
    git clone https://github.com/joakimtrulsson/keystone-app.git
    ```

2.  Navigera till rotmappen för projektet.

3.  Installera alla dependencies, inklusive frontend och server, med ett enda kommando:

    ```bash
    npm run install-all
    ```

4.  Detta kommer att bygga servern och starta den samt köra frontend-applikationen.
    Starta projektet genom att köra följande kommando:

    ```bash
    npm run start
    ```

5.  Öppna din webbläsare och navigera till http://localhost:3000 för att använda Admin UI. Om du vill se hur ditt innehåll visas i frontend, med standarddesignen från KeystoneJs, kan du öppna http://localhost:8000 i din webbläsare.

### Skript Beskrivningar

Här är några beskrivningar av de olika skripten:

- **install-all:** Ett enda kommando för att installera alla beroenden för både frontend och server.
- **server-start:** Bygg och starta serverapplikationen.
- **frontend-start:** Starta frontend-applikationen.
- **start:** Samtidigt starta både servern och frontend-applikationen.
