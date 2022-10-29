# PROJET : VOTING

## SYNOPSIS : Smart contract de vote pour une petite organisation.

      * Les électeurs, que l'organisation connaît tous, 
        sont inscrits sur une liste blanche(whitelist) grâce à leur adresse Ethereum. 
      * Ils peuvent soumettre de nouvelles propositions
        lors d'une session d'enregistrement des propositions.
      * Ils peuvent voter sur les propositions lors de la session de vote.
      * Le vote n'est pas secret pour les utilisateurs ajoutés à la Whitelist
      * Chaque électeur peut voir les votes des autres
      * Le gagnant est déterminé à la majorité simple
      * La proposition qui obtient le plus de voix l'emporte.


    👉 Le processus de vote : 

      * L'administrateur du vote enregistre une liste blanche d'électeurs identifiés
        par leur adresse Ethereum.
      * L'administrateur du vote commence la session d'enregistrement de la proposition.
      * Les électeurs inscrits sont autorisés à enregistrer leurs propositions
        pendant que la session d'enregistrement est active.
      * L'administrateur de vote met fin à la session d'enregistrement des propositions.
      * L'administrateur du vote commence la session de vote.
      * Les électeurs inscrits votent pour leur proposition préférée.
      * L'administrateur du vote met fin à la session de vote.
      * L'administrateur du vote comptabilise les votes.
      * Tout le monde peut vérifier les derniers détails de la proposition gagnante.


## REALISATION DES TESTS UNITAIRES

    Mise en place
      * Tests fait avec Truffle et Ganache
        npm install --localisation=global truffle --save
        npm install --localisation=global ganache --save

      * Fichier testé /contracts/voting.sol
        npm install --prefix . @openzeppelin/contracts --save

      * Fichier test  /test/test.sol
        npm install --prefix . @openzeppelin/test-helpers --save

      * Test de la consomation de gas
        npm install --prefix . eth-gas-reporter --save


## TESTS DU PROJET VOTING 

      5 groupes de tests
        - TESTS DES AUTORISATIONS
        - TEStS DES STATUS
        - TESTS FONCTIONNELS
        - TESTS DES EVENEMENTS
        - TESTS CONSOMMATION EN GAS


## TESTS DES AUTORISATIONS :

      Nous allons définir 3 types d'utilisateurs pour les tests d'autorisations
          * L'administrateur : admin    (ne faisant pas parti de la whiteliste)
          * Un électeur      : aVoter   (faisant parti de la whiteliste)
          * Un inconnu       : unknow   (ne faisant pas parti de la whiteliste)

      - L'administrateur déclenche chaque étape du cycle et inscrit les électeurs
          function addVoter                   >>   permission admin
          function startProposalsRegistering  >>   permission admin
          function endProposalsRegistering    >>   permission admin
          function startVotingSession         >>   permission admin
          function endVotingSession           >>   permission admin
          function tallyVotes                 >>   permission admin

      - Les électeurs peuvent accéder aux votes et aux propositions
          function getVoter                   >>   permission aVoter
          function getOneProposal             >>   permission aVoter
          function addProposal                >>   permission aVoter
          function setVote                    >>   permission aVoter


## TESTS DES STATUTS:

      - Chaque étape du cycle de vote a un status différent
          function startProposalsRegistering  >> status ProposalsRegistrationStarted
          function endProposalsRegistering    >> status ProposalsRegistrationEnded
          function startVotingSession         >> status VotingSessionStarted
          function endVotingSession           >> status VotingSessionEnded
          function tallyVotes                 >> status VotesTallied


## TESTS FONCTIONNELS :

      - Chaque proposition et chaque vote peuvent être consultés par les électeurs

          * GETTERS - Vérification des données attendus
              function getVoter
              function getOneProposal

      - Il y a quatre étapes différentes dans le process qui seront testées

          * REGISTRATION - Chaque électeur est enregistré dans la whiteliste
              function addVoter          
          
          * PROPOSAL - Chaque proposition a un électeur
              function addProposal

          * VOTE - Chaque électeur a un vote
              function setVote

          * RESULTAT DU VOTE - Chaque cycle de vote a une proposition gagnante
              function tallyVotes


## TESTS DES EVENEMENTS:
  
      - Chaque étape et chaque changement d'étape émet un événement
          function addVoter                   >>   évenement VoterRegistered
          function startProposalsRegistering  >>   évenement WorkflowStatusChange
          function addProposal                >>   évenement addProposal
          function endProposalsRegistering    >>   évenement WorkflowStatusChange
          function startVotingSession         >>   évenement WorkflowStatusChange
          function setVote                    >>   évenement setVote
          function endVotingSession           >>   évenement WorkflowStatusChange
          function tallyVotes                 >>   évenement WorkflowStatusChange


## TEST DE CONSOMATION DE GAS
      
      ·------------------------------------------|----------------------------|-------------|----------------------------·
      |   Solc version: 0.8.17+commit.8df45f5f   ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 6718946 gas  │
      ···········································|····························|·············|·····························
      |  Methods                                                                                                         │
      ·············|·····························|··············|·············|·············|··············|··············
      |  Contract  ·  Method                     ·  Min         ·  Max        ·  Avg        ·  # calls     ·  eur (avg)  │
      ·············|·····························|··············|·············|·············|··············|··············
      |  Voting    ·  addProposal                ·       59208  ·      59376  ·      59306  ·          16  ·          -  │
      ·············|·····························|··············|·············|·············|··············|··············
      |  Voting    ·  addVoter                   ·           -  ·          -  ·      50220  ·          43  ·          -  │
      ·············|·····························|··············|·············|·············|··············|··············
      |  Voting    ·  endProposalsRegistering    ·           -  ·          -  ·      30599  ·          10  ·          -  │
      ·············|·····························|··············|·············|·············|··············|··············
      |  Voting    ·  endVotingSession           ·           -  ·          -  ·      30533  ·           5  ·          -  │
      ·············|·····························|··············|·············|·············|··············|··············
      |  Voting    ·  setVote                    ·       60913  ·      78013  ·      74593  ·          15  ·          -  │
      ·············|·····························|··············|·············|·············|··············|··············
      |  Voting    ·  startProposalsRegistering  ·           -  ·          -  ·      95032  ·          14  ·          -  │
      ·············|·····························|··············|·············|·············|··············|··············
      |  Voting    ·  startVotingSession         ·           -  ·          -  ·      30554  ·          11  ·          -  │
      ·············|·····························|··············|·············|·············|··············|··············
      |  Voting    ·  tallyVotes                 ·       37849  ·      69381  ·      51435  ·           4  ·          -  │
      ·············|·····························|··············|·············|·············|··············|··············
      |  Deployments                             ·                                          ·  % of limit  ·             │
      ···········································|··············|·············|·············|··············|··············
      |  Voting                                  ·           -  ·          -  ·    2077414  ·      30.9 %  ·          -  │
      ·------------------------------------------|--------------|-------------|-------------|--------------|-------------·

## RESULTATS DES TESTS

      Contract: VOTING
        Tests des autorisations
          Authorisation: administrateur
            ✓ function addVoter (1680ms)
            ✓ function startProposalsRegistering (67ms)
            ✓ function endProposalsRegistering (86ms)
            ✓ function startVotingSession (69ms)
            ✓ function endVotingSession (47ms)
            ✓ function tallyVotes (45ms)
          Authorisation: électeurs
            ✓ function getVoter (40ms)
            ✓ function getOneProposal (39ms)
            ✓ function addProposal (58ms)
            ✓ function setVote (30ms)
        Tests des status
          ✓ test le status de la fonction startProposalsRegistering (63ms, 95032 gas)
          ✓ test le status de la fonction endProposalsRegistering (47ms, 30599 gas)
          ✓ test le status de la fonction startVotingSession (38ms, 30554 gas)
          ✓ test le status de la fonction endVotingSession (46ms, 30533 gas)
          ✓ test le status de la fonction tallyVotes (99ms, 37849 gas)
        Tests fonctionnels
          GETTERS
            ✓ test le retour de la fonction getVoter (142ms, 139166 gas)
            ✓ test le retour de la fonction getOneProposal (17ms)
          REGISTRATION - function addVoter
            ✓ test si l'électeur a déjà été enregistré (15ms)
            ✓ test si l'électeur a bien été enregistré (64ms, 50220 gas)
          PROPOSAL - function addProposal
            ✓ test si la proposition peut-être enregistrée (33ms)
            ✓ test si la proposition a bien été enregistrée (127ms, 118608 gas)
          VOTE - function setVote
            ✓ test si l'électeur n'a pas déjà voté (60ms, 78013 gas)
            ✓ test si la proposition de vote existe (18ms)
            ✓ test si le vote a bien été enregistré (59ms, 78013 gas)
            ✓ test si le vote a bien été comptabilisé (130ms, 138926 gas)
          RESULTAT DU VOTE - function tallyVotes
            ✓ test si le résultat de vote est le bon et a bien été enregistré (899ms, 3066561 gas)
        Contract: Tests des évenerments
          ✓ function addVoter (46ms, 50220 gas)
          ✓ function startProposalsRegistering (42ms, 95032 gas)
          ✓ function addProposal (52ms, 59208 gas)
          ✓ function endProposalsRegistering (52ms, 30599 gas)
          ✓ function startVotingSession (43ms, 30554 gas)
          ✓ function setVote (52ms, 78013 gas)
          ✓ function endVotingSession (44ms, 30533 gas)
          ✓ function tallyVotes (52ms, 60661 gas)