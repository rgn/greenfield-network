'use strict';

/**
 * Release the given days to all personal wallets
 * @param {com.trivadis.greenfield.PersonalWalletReleaseDays} increases the existing days by x , to all personal wallets
 * @return {Promise} Asset Registry Promise
 * @transaction
 */
function onPersonalWalletReleaseDays(tx) {

  console.log('### onReleaseDays ' + tx.toString());
  
  return getAssetRegistry('com.trivadis.greenfield.PersonalWallet')
  	.then(function(assetRegistry) {
      return query('selectPersonalWallets')
        .then(function(results) {        
          var promises = [];
        
          for (var i = 0; i < results.length; i++) {            
            var personalWallet = results[i];
            
            personalWallet.days += tx.days;
            promises.push(assetRegistry.update(personalWallet));
          }
        		  
          var releaseDaysEvent = getFactory().newEvent('com.trivadis.greenfield', 'ReleaseDaysEvent');        
          emit(releaseDaysEvent);
        
          return Promise.all(promises);
      	});
  	});
}

/**
 * Revoke the given days to all personal wallets
 * @param {com.trivadis.greenfield.PersonalWalletRevokeDays} revoke x days to all personal wallets, 0 = all days
 * @return {Promise} Asset Registry Promise
 * @transaction
 */
function onPersonalWalletRevokeDays(tx) {
  
  console.log('### onRevokeDays ' + tx.toString());
  
  return getAssetRegistry('com.trivadis.greenfield.PersonalWallet')
  	.then(function(assetRegistry) {
      return query('selectPersonalWallets')
        .then(function(results) {        
          var promises = [];
        
          for (var i = 0; i < results.length; i++) {            
            var personalWallet = results[i];
            
            if (tx.days > 0.0) {
            	personalWallet.days -= tx.days;
            }
            else {
              personalWallet.days = 0;
            }
            
            promises.push(assetRegistry.update(personalWallet));
          }
        
		  // emit a notification that a trade was removed
          var revokeDaysEvent = getFactory().newEvent('com.trivadis.greenfield', 'RevokeDaysEvent');        
          emit(revokeDaysEvent);
        
          return Promise.all(promises);
      	});
  	});
}

/**
 * Follow an idea
 * @param {com.trivadis.greenfield.IdeaFollow} idea to be followed
 * @return {Promise} Asset Registry Promise
 * @transaction
 */
function onIdeaFollow(tx) {
  console.log('### onFollowIdea ' + tx.toString());
  
  if (tx.idea.followedBy === undefined)
    tx.idea.followedBy = [];
  
  if (!tx.idea.followedBy.includes(tx.person)) {
      
      tx.idea.followedBy.push(tx.person);
      
      return getAssetRegistry('com.trivadis.greenfield.Idea').then(function(result) {      
    	var ideaFollowedEvent = getFactory().newEvent('com.trivadis.greenfield', 'IdeaFollowedEvent');
        ideaFollowedEvent.person = tx.person;
        ideaFollowedEvent.count = tx.idea.followedBy.length;
        emit(ideaFollowedEvent);
        return result.update(tx.idea);        
  	  });    	    
  }  
}

/**
 * Like an idea
 * @param {com.trivadis.greenfield.IdeaLike} idea to be liked
 * @return {Promise} Asset Registry Promise
 * @transaction
 */
function onIdeaLike(tx) {
  console.log('### onLikeIdea ' + tx.toString());
  
  if (tx.idea.likedBy === undefined)
    tx.idea.likedBy = [];
  
  if (!tx.idea.likedBy.includes(tx.person)) {
  	tx.idea.likedBy.push(tx.person);
    
    return getAssetRegistry('com.trivadis.greenfield.Idea').then(function(result) {      
    	var ideaLikedEvent = getFactory().newEvent('com.trivadis.greenfield', 'IdeaLikedEvent');
        ideaLikedEvent.person = tx.person;
        ideaLikedEvent.count = tx.idea.likedBy.length;
        emit(ideaLikedEvent);
        return result.update(tx.idea);        
  	  });    	
  }
}

/**
 * Change current state of an idea
 * @param {com.trivadis.greenfield.IdeaStateChange} The idea to change the state
 * @return {Promise} Asset Registry Promise
 * @transaction
 */
function onIdeaStateChange(tx) {
  console.log('### onIdeaStateChange ' + tx.toString());
  
  var ideaStateChangeEvent = getFactory().newEvent('com.trivadis.greenfield', 'IdeaStateChangeEvent');
  var performStateChange = false;
  var oldState = tx.idea.state;
  var newState = tx.state;
  
  if (oldState === 'FRESH' && (newState === 'INWORK' || newState == 'FINISHED')) {
      performStateChange = true;
  }
  else if (oldState === 'INWORK' && (newState == 'FINISHED')) {
      performStateChange = true;
  }   
  
  if (performStateChange) {
     tx.idea.state = newState;
  }  
  
  return getAssetRegistry('com.trivadis.greenfield.Idea').then(function(result) {      
	var ideaStateChangeEvent = getFactory().newEvent('com.trivadis.greenfield', 'IdeaStateChangeEvent');    
    
    ideaStateChangeEvent.idea = tx.idea;
    ideaStateChangeEvent.oldState = oldState;
    ideaStateChangeEvent.newState = tx.idea.state;
    
    emit(ideaStateChangeEvent);
    
    return result.update(tx.idea);        
  });
}

/**
 * Process the donation of a person to an idea
 * @param {com.trivadis.greenfield.IdeaDonateDays} wallet and idea related to the donation
 * @return {Promise} Asset Registry Promise
 * @transaction
 */
function onDonateDays(donation) {   

  console.log('### onDonateDays ' + donation.toString());

  if (donation.wallet.days >= donation.days) {	      	

    donation.idea.days += donation.days;
    donation.wallet.days -= donation.days;
        
    var message = 'donation successfull';
    var donationSuccessEvent = getFactory().newEvent('com.trivadis.greenfield', 'DonationSuccessEvent');
    
    donationSuccessEvent.daysRemaining = donation.wallet.days;
    donationSuccessEvent.message = message;
    
    emit(donationSuccessEvent);
    
    var receivedDonation = getFactory().newEvent('com.trivadis.greenfield', 'ReceivedDonationEvent');        
    //receivedDonation.idea = donation.idea;
    receivedDonation.days = donation.days;
    
    emit(receivedDonation);
    
  } else {        
    var message = 'donation not possible, insufficient amount of days';
    var donationFailedEvent = getFactory().newEvent('com.trivadis.greenfield', 'DonationFailedEvent');
            
    donationFailedEvent.daysToDonate = donation.days;
    donationFailedEvent.daysToDonate = donation.wallet.days;    
    donationFailedEvent.message = message;
        
    emit(donationFailedEvent);
    
    console.log('### onDonateDays ' + message);
  }  	

  getAssetRegistry('com.trivadis.greenfield.PersonalWallet').then(function(result) {
    return result.update(donation.wallet);
  });

  return getAssetRegistry('com.trivadis.greenfield.Idea').then(function(result) {      
    return result.update(donation.idea);
  });
}
