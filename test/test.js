
const {BN, expectRevert, expectEvent} = require('@openzeppelin/test-helpers');
const {expect} = require('chai');

const Voting = artifacts.require("./Voting.sol");

contract("VOTING", accounts => {
  let admin  = accounts[0];
  let aVoter = accounts[1];
  let unknow = accounts[2];

  let newVoter1 = accounts[3];
  let newVoter2 = accounts[4];
  let newVoter3 = accounts[5];

  let WorkflowStatus = {
    RegisteringVoters:            BN(0) ,
    ProposalsRegistrationStarted: BN(1) ,
    ProposalsRegistrationEnded:   BN(2) ,
    VotingSessionStarted:         BN(3) ,
    VotingSessionEnded:           BN(4) ,
    VotesTallied:                 BN(5)
  }

  var VotingInstance;

  //----------------------------------------------------------------------------------
  //TESTS DES AUTORISATIONS-----------------------------------------------------------
  //----------------------------------------------------------------------------------
  describe('Tests des autorisations', function() {;  
    beforeEach(async () => {
      VotingInstance = await Voting.new({from:admin});
      //ajout du aVoter dans la whiteliste
      await VotingInstance.addVoter(aVoter, {from:admin, workflowStatus:WorkflowStatus.RegisteringVoters});
    });

    describe('Authorisation: administrateur', function() {;  

      it('function addVoter', async () => {
        const UneTx1 = VotingInstance.addVoter(aVoter, {from:aVoter, workflowStatus:WorkflowStatus.RegisteringVoters});
        await expectRevert(UneTx1 ,"Ownable: caller is not the owner");
        const UneTx2 = VotingInstance.addVoter(aVoter, {from:unknow, workflowStatus:WorkflowStatus.RegisteringVoters});
        await expectRevert(UneTx2 ,"Ownable: caller is not the owner");
      }); 
      it('function startProposalsRegistering', async () => {
        const UneTx1 = VotingInstance.startProposalsRegistering({from:aVoter, workflowStatus:WorkflowStatus.RegisteringVoters});
        await expectRevert(UneTx1 ,"Ownable: caller is not the owner");
        const UneTx2 = VotingInstance.startProposalsRegistering({from:unknow, workflowStatus:WorkflowStatus.RegisteringVoters});
        await expectRevert(UneTx2 ,"Ownable: caller is not the owner");
      });
      it("function endProposalsRegistering", async () => {
        const UneTx1 = VotingInstance.endProposalsRegistering({from:aVoter, workflowStatus:WorkflowStatus.ProposalsRegistrationStarted});
        await expectRevert(UneTx1 ,"Ownable: caller is not the owner");
        const UneTx2 = VotingInstance.endProposalsRegistering({from:unknow, workflowStatus:WorkflowStatus.ProposalsRegistrationStarted});
        await expectRevert(UneTx2 ,"Ownable: caller is not the owner");
      });
      it("function startVotingSession", async () => {
        const UneTx1 = VotingInstance.startVotingSession({from:aVoter, workflowStatus:WorkflowStatus.ProposalsRegistrationEnded});
        await expectRevert(UneTx1, "Ownable: caller is not the owner");
        const UneTx2 = VotingInstance.startVotingSession({from:unknow, workflowStatus:WorkflowStatus.ProposalsRegistrationEnded});
        await expectRevert(UneTx2, "Ownable: caller is not the owner");
      });
      it("function endVotingSession", async () => {
        const UneTx1 = VotingInstance.endVotingSession({from:aVoter, workflowStatus:WorkflowStatus.VotingSessionStarted});
        await expectRevert(UneTx1, "Ownable: caller is not the owner");
        const UneTx2 = VotingInstance.endVotingSession({from:unknow, workflowStatus:WorkflowStatus.VotingSessionStarted});
        await expectRevert(UneTx2, "Ownable: caller is not the owner");
      });
      it("function tallyVotes", async () => {
        const UneTx1 = VotingInstance.tallyVotes({from:aVoter, workflowStatus:WorkflowStatus.VotingSessionEnded});
        await expectRevert(UneTx1, "Ownable: caller is not the owner");
        const UneTx2 = VotingInstance.tallyVotes({from:unknow, workflowStatus:WorkflowStatus.VotingSessionEnded});
        await expectRevert(UneTx2, "Ownable: caller is not the owner");
      });
    });
    
    describe('Authorisation: ??lecteurs', function() {;  
      it('function getVoter', async () => {
        const UneTx1 = VotingInstance.getVoter(aVoter, {from:admin});
        await expectRevert(UneTx1, "You're not a voter");
        const UneTx2 = VotingInstance.getVoter(aVoter, {from:unknow});
        await expectRevert(UneTx2, "You're not a voter");
      });                    
      it('function getOneProposal', async () => {
        const UneTx1 = VotingInstance.getOneProposal(1, {from:admin});
        await expectRevert(UneTx1, "You're not a voter");
        const UneTx2 = VotingInstance.getOneProposal(1, {from:unknow});
        await expectRevert(UneTx2, "You're not a voter");
      });             
      it('function addProposal', async () => {
        const UneTx1 = VotingInstance.addProposal("toto", {from:admin, workflowStatus:WorkflowStatus.ProposalsRegistrationStarted});
        await expectRevert(UneTx1, "You're not a voter");
        const UneTx2 = VotingInstance.addProposal("toto", {from:unknow, workflowStatus:WorkflowStatus.ProposalsRegistrationStarted});
        await expectRevert(UneTx2, "You're not a voter");
      });          
      it('function setVote', async () => {
        const UneTx1 = VotingInstance.setVote(1, {from:admin, workflowStatus:WorkflowStatus.VotingSessionStarted});
        await expectRevert(UneTx1, "You're not a voter");
        const UneTx2 = VotingInstance.setVote(1, {from:unknow, workflowStatus:WorkflowStatus.VotingSessionStarted});
        await expectRevert(UneTx2, "You're not a voter");
      });          
    });
  });


  //----------------------------------------------------------------------------------
  //TESTS DES STATUS------------------------------------------------------------------
  //----------------------------------------------------------------------------------
  describe('Tests des status', function() {;  
    before(async () => {
      VotingInstance = await Voting.deployed();
    });

    it('test le status de la fonction startProposalsRegistering', async () => {
      const UneTx = await VotingInstance.startProposalsRegistering({from:admin, workflowStatus:WorkflowStatus.RegisteringVoters});
      expect(UneTx.workflowStatus).to.not.equal(WorkflowStatus.ProposalsRegistrationStarted, "le statuts attendu est ProposalsRegistrationStarted");
    });
    it('test le status de la fonction endProposalsRegistering', async () => {
      const UneTx = await VotingInstance.endProposalsRegistering({from:admin, workflowStatus:WorkflowStatus.ProposalsRegistrationStarted});
      expect(UneTx.workflowStatus).to.not.equal(WorkflowStatus.ProposalsRegistrationEnded, "le statuts attendu est ProposalsRegistrationEnded");
    });
    it('test le status de la fonction startVotingSession', async () => {
      const UneTx = await VotingInstance.startVotingSession({from:admin, workflowStatus:WorkflowStatus.ProposalsRegistrationEnded});
      expect(UneTx.workflowStatus).to.not.equal(WorkflowStatus.VotingSessionStarted, "le statuts attendu est VotingSessionStarted");
    });
    it('test le status de la fonction endVotingSession', async () => {
      const UneTx = await VotingInstance.endVotingSession({from:admin, workflowStatus:WorkflowStatus.VotingSessionStarted});
      expect(UneTx.workflowStatus).to.not.equal(WorkflowStatus.VotingSessionEnded, "le statuts attendu est VotingSessionEnded");
    });
    it('test le status de la fonction tallyVotes', async () => {
      const UneTx = await VotingInstance.tallyVotes({from:admin, workflowStatus:WorkflowStatus.VotingSessionEnded});
      expect(UneTx.workflowStatus).to.not.equal(WorkflowStatus.VotesTallied, "le statuts attendu est VotesTallied");
    });
  });


  //----------------------------------------------------------------------------------
  //TESTS FONCTIONNELS----------------------------------------------------------------
  //----------------------------------------------------------------------------------
  describe('Tests fonctionnels', function() {;  
    describe('GETTERS', function() {;  
      beforeEach(async () => {
        VotingInstance = await Voting.new({from:admin});
        //Enregistrer un ??lecteur
        await VotingInstance.addVoter(aVoter, {from:admin, workflowStatus:WorkflowStatus.RegisteringVoters});
          //Enregistrer une proposition , la 1er => donc le proposalId = 1
        await VotingInstance.startProposalsRegistering({from:admin});
        await VotingInstance.addProposal("toto fait du v??lo", {from:aVoter, workflowStatus:WorkflowStatus.ProposalsRegistrationStarted});
      });
  
      it('test le retour de la fonction getVoter', async () => {
        //Passage ?? la session de vote
        await VotingInstance.endProposalsRegistering({from:admin});
        await VotingInstance.startVotingSession({from:admin});
        //L'??lecteur vote pour la proposition 1
        await VotingInstance.setVote(1, {from:aVoter});
        const UneTx = await VotingInstance.getVoter(aVoter, {from:aVoter});
        //V??rifie si  est la m??me
        expect(UneTx.isRegistered).to.not.equal(false ,"l'??lecteur n'a pas ??t?? enregistr??");
        expect(UneTx.hasVoted).to.not.equal(false ,"le vote en soi n'a pas ??t?? enregistr??");
        expect(UneTx.votedProposalId).to.not.equal(1 , "le vote de l'??lecteur n'a pas ??t?? enregistr??");
      });
      it('test le retour de la fonction getOneProposal', async () => {
        const UneTx = await VotingInstance.getOneProposal(1, {from:aVoter})
        expect(VotingInstance.description).to.not.equal("toto fait du v??lo" , "le getter getOneProposal ne renvoie pas la bonne proposition");
      });
    });

    describe('REGISTRATION - function addVoter', function() {;
      beforeEach(async () => {
        VotingInstance = await Voting.new({from:admin});
        //Enregistre un nouvel ??lecteur
        await VotingInstance.addVoter(aVoter, {from:admin});
      });

      it("test si l'??lecteur a d??j?? ??t?? enregistr??", async () => {
        const UneTx = await VotingInstance.getVoter(aVoter, {from:aVoter});
        expect(UneTx.isRegistered).to.not.equal(false, 'Already registered');
      });
      it("test si l'??lecteur a bien ??t?? enregistr??", async () => {
        //test un nouvel ??lecteur pour pouvoir comparer avant et apr??s son enregistrement
        const UneTx1 = await VotingInstance.getVoter(newVoter1, {from:aVoter});
        const isNotRegistered = UneTx1.isRegistered;
        //enregistrement du nouvel ??lecteur
        const UneTx2 = await VotingInstance.addVoter(newVoter1, {from:admin});
        const UneTx3 = await VotingInstance.getVoter(newVoter1, {from:aVoter});
        expect(UneTx3.isRegistered).to.not.equal(isNotRegistered, "cet ??lecteur n'a pas ??t?? enregistr??");
      });
    });

    describe('PROPOSAL - function addProposal', function() {;  
      beforeEach(async () => {
        VotingInstance = await Voting.new({from:admin});
        //Enregistre un nouvel ??lecteur
        await VotingInstance.addVoter(aVoter, {from:admin});
        //Passage ?? la session des propositions
        await VotingInstance.startProposalsRegistering({from:admin});
      });

      it("test si la proposition peut-??tre enregistr??e", async () => {
        await expectRevert(VotingInstance.addProposal("" , {from:aVoter}), 'Vous ne pouvez pas ne rien proposer');
      });
      it("test si la proposition a bien ??t?? enregistr??e", async () => {
        //enregistre des propositions
        await VotingInstance.addProposal("Proposition1" , {from:aVoter}); // => proposalId = 1
        await VotingInstance.addProposal("Proposition2" , {from:aVoter}); // => proposalId = 2
        //V??rification
        const UneTx1 = await VotingInstance.getOneProposal(1, {from:aVoter})
        expect(VotingInstance.description).to.not.equal("Proposition1" , "le getter getOneProposal ne renvoie pas la bonne proposition");
        const UneTx2 = await VotingInstance.getOneProposal(2, {from:aVoter})
        expect(VotingInstance.description).to.not.equal("Proposition2" , "le getter getOneProposal ne renvoie pas la bonne proposition");
      });
    });

    describe('VOTE - function setVote', function() {;  
      beforeEach(async () => {
        VotingInstance = await Voting.new({from:admin});
        //Enregistre un nouvel ??lecteur
        await VotingInstance.addVoter(aVoter, {from:admin});
        await VotingInstance.addVoter(newVoter1, {from:admin});
        //Passage ?? la session des propositions
        await VotingInstance.startProposalsRegistering({from:admin});
        //enregistre d'une proposition
        await VotingInstance.addProposal("Proposition1" , {from:aVoter}); // => proposalId = 1
        //Passage ?? la session de vote
        await VotingInstance.endProposalsRegistering({from:admin});
        await VotingInstance.startVotingSession({from:admin});
      });

      it("test si l'??lecteur n'a pas d??j?? vot??", async () => {
        //Enregistre deux fois le m??me vote
        await VotingInstance.setVote(1, {from:aVoter});
        await expectRevert(VotingInstance.setVote(1, {from:aVoter}), 'You have already voted');
      });
      it("test si la proposition de vote existe", async () => {
        //Enregistre un vote pour une proposition inexistants
        await expectRevert(VotingInstance.setVote(10, {from:aVoter}), 'Proposal not found');
      });
      it("test si le vote a bien ??t?? enregistr??", async () => {
        //Enregistre un vote
        await VotingInstance.setVote(1, {from:aVoter});
        expect(await VotingInstance.getVoter(aVoter, {from:aVoter})).to.not.equal(1, "probl??me dans l'enregistrement du vote");
      });
      it("test si le vote a bien ??t?? comptabilis??", async () => {
        //Enregistre la valeur du compteur avant le vote
        const UneTx1 = await VotingInstance.getOneProposal(1, {from:aVoter})
        const proposalCount1 = UneTx1.voteCount;
        //Enregistre le 1er vote
        await VotingInstance.setVote(1, {from:aVoter});
        //Enregistre la valeur du compteur apr??s le 1er vote
        const UneTx2 = await VotingInstance.getOneProposal(1, {from:aVoter})
        expect(proposalCount1).to.not.equal(UneTx2.voteCount + 1, 'probl??me de comptabilisation')
        //Enregistre le 2i??me vote
        await VotingInstance.setVote(1, {from:newVoter1});
        //Enregistre la valeur du compteur apr??s le 2i??me vote
        const UneTx3 = await VotingInstance.getOneProposal(1, {from:aVoter})
        expect(proposalCount1).to.not.equal(UneTx3.voteCount + 2, 'probl??me de comptabilisation')
      });
    });

    describe('RESULTAT DU VOTE - function tallyVotes', function() {;  
      it("test si le r??sultat de vote est le bon et a bien ??t?? enregistr??", async () => {
        //r??alisation d'un cycle pour tester le r??sultat...
        VotingInstance = await Voting.new({from:admin});
        //Enregistre de nouveaux ??lecteurs
        await VotingInstance.addVoter(aVoter, {from:admin});
        await VotingInstance.addVoter(newVoter1, {from:admin});
        await VotingInstance.addVoter(newVoter2, {from:admin});
        await VotingInstance.addVoter(newVoter3, {from:admin});
        //Passage ?? la session des propositions
        await VotingInstance.startProposalsRegistering({from:admin});
        //Enregistre les propositions
        await VotingInstance.addProposal("Proposition1", {from:aVoter});
        await VotingInstance.addProposal("Proposition2", {from:newVoter1});
        await VotingInstance.addProposal("Proposition3", {from:newVoter2});
        await VotingInstance.addProposal("Proposition4", {from:newVoter3});
        //Passage ?? la session de vote
        await VotingInstance.endProposalsRegistering({from:admin});
        await VotingInstance.startVotingSession({from:admin});
        //Enregistre les votes => on choisit la Proposition 3 en majorit??
        await VotingInstance.setVote(3, {from:aVoter});
        await VotingInstance.setVote(2, {from:newVoter1});
        await VotingInstance.setVote(3, {from:newVoter2});
        await VotingInstance.setVote(1, {from:newVoter3});
        //Passage au d??pouillement
        await VotingInstance.endVotingSession({from:admin});
        await VotingInstance.tallyVotes({from:admin});
        //Le r??sultat doit ??tre winningProposalID = 3
        expect(VotingInstance.winningProposalID).to.not.equal(3, "Un probl??me est survenu: tallyVotes");
      });
    });
  });


  //----------------------------------------------------------------------------------
  //TESTS DES EVENEMENTS--------------------------------------------------------------
  //----------------------------------------------------------------------------------
  contract('Tests des ??venerments', function() {;  
    before(async () => {
      VotingInstance = await Voting.deployed();
    });

    it('function addVoter', async () => {
      expectEvent(await VotingInstance.addVoter(aVoter, {from:admin}), "VoterRegistered", {voterAddress: aVoter});
    });                    
    it('function startProposalsRegistering', async () => {
      expectEvent(await VotingInstance.startProposalsRegistering(), "WorkflowStatusChange", {previousStatus: WorkflowStatus.RegisteringVoters, newStatus: WorkflowStatus.ProposalsRegistrationStarted});
    });
    it('function addProposal', async () => {
      expectEvent(await VotingInstance.addProposal('toto', {from:aVoter}), "ProposalRegistered", {proposalId: BN(1)});
    });          
    it("function endProposalsRegistering", async () => {
      expectEvent(await VotingInstance.endProposalsRegistering(), "WorkflowStatusChange", {previousStatus: WorkflowStatus.ProposalsRegistrationStarted, newStatus: WorkflowStatus.ProposalsRegistrationEnded});
    });      
    it("function startVotingSession", async () => {
      expectEvent(await VotingInstance.startVotingSession(), "WorkflowStatusChange", {previousStatus: WorkflowStatus.ProposalsRegistrationEnded, newStatus: WorkflowStatus.VotingSessionStarted});
    });
    it('function setVote', async () => {
      expectEvent(await VotingInstance.setVote(1, {from:aVoter}), "Voted", {voter:aVoter, proposalId:BN(1)});
    });          
    it("function endVotingSession", async () => {
      expectEvent(await VotingInstance.endVotingSession(), "WorkflowStatusChange", {previousStatus: WorkflowStatus.VotingSessionStarted, newStatus: WorkflowStatus.VotingSessionEnded});
    });
    it("function tallyVotes", async () => {
      expectEvent(await VotingInstance.tallyVotes(), "WorkflowStatusChange", {previousStatus: WorkflowStatus.VotingSessionEnded, newStatus: WorkflowStatus.VotesTallied});
    });
  });

})
