(this["webpackJsonpmagic-hat-mint"]=this["webpackJsonpmagic-hat-mint"]||[]).push([[0],{128:function(e,t,n){"use strict";n.d(t,"a",(function(){return u}));var a,i=n(14),s=n(2),r=n(0),c=n.n(r),o=n(4),l=n(83);!function(e){e[e.Sequential=0]="Sequential",e[e.Parallel=1]="Parallel",e[e.StopOnFailure=2]="StopOnFailure"}(a||(a={}));var u=function(){var e=Object(s.a)(c.a.mark((function e(t,n,s,r){var u,m,d,f,p,h,b,y,S,j,w,v,M,x,O=arguments;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(u=O.length>4&&void 0!==O[4]?O[4]:a.Parallel,m=O.length>5&&void 0!==O[5]?O[5]:"singleGossip",d=O.length>6&&void 0!==O[6]?O[6]:function(e,t){},f=O.length>7&&void 0!==O[7]?O[7]:function(e,t){return!1},p=O.length>8?O[8]:void 0,n.publicKey){e.next=7;break}throw new l.e;case 7:if(h=[],p){e.next=12;break}return e.next=11,t.getRecentBlockhash(m);case 11:p=e.sent;case 12:b=function(e){var t=s[e],a=r[e];if(0===t.length)return"continue";var c=new o.Transaction;t.forEach((function(e){return c.add(e)})),c.recentBlockhash=p.blockhash,c.setSigners.apply(c,[n.publicKey].concat(Object(i.a)(a.map((function(e){return e.publicKey}))))),a.length>0&&c.partialSign.apply(c,Object(i.a)(a)),h.push(c)},y=0;case 14:if(!(y<s.length)){e.next=21;break}if("continue"!==b(y)){e.next=18;break}return e.abrupt("continue",18);case 18:y++,e.next=14;break;case 21:return e.next=23,n.signAllTransactions(h);case 23:S=e.sent,j=[],w={breakEarly:!1,i:0},console.log("Signed txns length",S.length,"vs handed in length",s.length),v=c.a.mark((function e(n){var i;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if((i=g({connection:t,signedTransaction:S[n]})).then((function(e){var t=e.txid;e.slot;d(t,n)})).catch((function(e){f(S[n],n),u===a.StopOnFailure&&(w.breakEarly=!0,w.i=n)})),u===a.Parallel){e.next=21;break}return e.prev=3,e.next=6,i;case 6:e.next=19;break;case 8:if(e.prev=8,e.t0=e.catch(3),console.log("Caught failure",e.t0),!w.breakEarly){e.next=19;break}return console.log("Died on ",w.i),e.t1=w.i,e.next=16,Promise.all(j);case 16:return e.t2=e.sent,e.t3={number:e.t1,txs:e.t2},e.abrupt("return",{v:e.t3});case 19:e.next=22;break;case 21:j.push(i);case 22:case"end":return e.stop()}}),e,null,[[3,8]])})),M=0;case 29:if(!(M<S.length)){e.next=37;break}return e.delegateYield(v(M),"t0",31);case 31:if("object"!==typeof(x=e.t0)){e.next=34;break}return e.abrupt("return",x.v);case 34:M++,e.next=29;break;case 37:if(u===a.Parallel){e.next=40;break}return e.next=40,Promise.all(j);case 40:return e.t1=S.length,e.next=43,Promise.all(j);case 43:return e.t2=e.sent,e.abrupt("return",{number:e.t1,txs:e.t2});case 45:case"end":return e.stop()}}),e)})));return function(t,n,a,i){return e.apply(this,arguments)}}(),m=function(){return(new Date).getTime()/1e3},d=15e3;function g(e){return f.apply(this,arguments)}function f(){return(f=Object(s.a)(c.a.mark((function e(t){var n,a,i,r,o,l,u,g,f,h,y,j,w;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.signedTransaction,a=t.connection,i=t.timeout,r=void 0===i?d:i,o=n.serialize(),l=m(),u=0,e.next=6,a.sendRawTransaction(o,{skipPreflight:!0});case 6:return g=e.sent,console.log("Started awaiting confirmation for",g),f=!1,Object(s.a)(c.a.mark((function e(){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(f||!(m()-l<r)){e.next=6;break}return a.sendRawTransaction(o,{skipPreflight:!0}),e.next=4,S(500);case 4:e.next=0;break;case 6:case"end":return e.stop()}}),e)})))(),e.prev=10,e.next=13,b(g,r,a,"recent",!0);case 13:if(h=e.sent){e.next=16;break}throw new Error("Timed out awaiting confirmation on transaction");case 16:if(!h.err){e.next=19;break}throw console.error(h.err),new Error("Transaction failed: Custom instruction error");case 19:u=(null===h||void 0===h?void 0:h.slot)||0,e.next=47;break;case 22:if(e.prev=22,e.t0=e.catch(10),console.error("Timeout Error caught",e.t0),!e.t0.timeout){e.next=27;break}throw new Error("Timed out awaiting confirmation on transaction");case 27:return y=null,e.prev=28,e.next=31,p(a,n,"single");case 31:y=e.sent.value,e.next=36;break;case 34:e.prev=34,e.t1=e.catch(28);case 36:if(!y||!y.err){e.next=47;break}if(!y.logs){e.next=46;break}j=y.logs.length-1;case 39:if(!(j>=0)){e.next=46;break}if(!(w=y.logs[j]).startsWith("Program log: ")){e.next=43;break}throw new Error("Transaction failed: "+w.slice("Program log: ".length));case 43:--j,e.next=39;break;case 46:throw new Error(JSON.stringify(y.err));case 47:return e.prev=47,f=!0,e.finish(47);case 50:return console.log("Latency",g,m()-l),e.abrupt("return",{txid:g,slot:u});case 52:case"end":return e.stop()}}),e,null,[[10,22,47,50],[28,34]])})))).apply(this,arguments)}function p(e,t,n){return h.apply(this,arguments)}function h(){return(h=Object(s.a)(c.a.mark((function e(t,n,a){var i,s,r,o,l;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t._recentBlockhash(t._disableBlockhashCaching);case 2:return n.recentBlockhash=e.sent,i=n.serializeMessage(),s=n._serialize(i),r=s.toString("base64"),o=[r,{encoding:"base64",commitment:a}],e.next=10,t._rpcRequest("simulateTransaction",o);case 10:if(!(l=e.sent).error){e.next=13;break}throw new Error("failed to simulate transaction: "+l.error.message);case 13:return e.abrupt("return",l.result);case 14:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function b(e,t,n){return y.apply(this,arguments)}function y(){return y=Object(s.a)(c.a.mark((function e(t,n,a){var i,r,o,l,u,m=arguments;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return i=m.length>3&&void 0!==m[3]?m[3]:"recent",r=m.length>4&&void 0!==m[4]&&m[4],o=!1,l={slot:0,confirmations:0,err:null},u=0,e.next=7,new Promise(function(){var e=Object(s.a)(c.a.mark((function e(m,d){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:setTimeout((function(){o||(o=!0,console.log("Rejecting for timeout..."),d({timeout:!0}))}),n);try{u=a.onSignature(t,(function(e,t){o=!0,l={err:e.err,slot:t.slot,confirmations:0},e.err?(console.log("Rejected via websocket",e.err),d(l)):(console.log("Resolved via websocket",e),m(l))}),i)}catch(g){o=!0,console.error("WS error in setup",t,g)}case 2:if(o||!r){e.next=8;break}return Object(s.a)(c.a.mark((function e(){var n;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,a.getSignatureStatuses([t]);case 3:n=e.sent,l=n&&n.value[0],o||(l?l.err?(console.log("REST error for",t,l),o=!0,d(l.err)):l.confirmations?(console.log("REST confirmation for",t,l),o=!0,m(l)):console.log("REST no confirmations for",t,l):console.log("REST null result for",t,l)),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),o||console.log("REST connection error: txid",t,e.t0);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})))(),e.next=6,S(2e3);case 6:e.next=2;break;case 8:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}());case 7:return l=e.sent,a&&a._signatureSubscriptions&&a._signatureSubscriptions[u]&&a.removeSignatureListener(u),o=!0,console.log("Returning status",l),e.abrupt("return",l);case 12:case"end":return e.stop()}}),e)}))),y.apply(this,arguments)}function S(e){return new Promise((function(t){return setTimeout(t,e)}))}},159:function(e,t,n){"use strict";(function(e){n.d(t,"a",(function(){return l}));n(10);var a=n(2),i=n(0),s=n.n(i),r=n(17),c=(n(32),n(4),n(128),n(160)),o=(n(40),n(28),new r.d.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),new r.d.PublicKey("JBw14YzhNTQGqUX54MatDgxDrCPopKf4EGcJHoHfq5ha")),l=function(){var e=Object(a.a)(s.a.mark((function e(t,n,a){var i,l,u,m,d,g,f,p,h;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return l=new r.b(a,t,{preflightCommitment:"recent"}),u=c,m=new r.a(u,o,l),e.next=5,m.account.magicHat.fetch(n);case 5:return d=e.sent,console.log(d.authority.toBase58()),g=d.data.itemsAvailable.toNumber(),f=d.itemsRedeemed.toNumber(),p=g-f,h=d.data.whitelistMintSettings&&d.data.whitelistMintSettings.presale&&(!d.data.goLiveDate||d.data.goLiveDate.toNumber()>(new Date).getTime()/1e3),e.abrupt("return",{id:n,program:m,state:{itemsAvailable:g,itemsRedeemed:f,itemsRemaining:p,isSoldOut:0===p,isActive:(h||(null===(i=d.data.goLiveDate)||void 0===i?void 0:i.toNumber())<(new Date).getTime()/1e3)&&(!d.data.endSettings||(d.data.endSettings.endSettingType.date?d.data.endSettings.number.toNumber()>(new Date).getTime()/1e3:f<d.data.endSettings.number.toNumber())),isPresale:h,goLiveDate:d.data.goLiveDate,treasury:d.wallet,tokenMint:d.tokenMint,gatekeeper:d.data.gatekeeper,endSettings:d.data.endSettings,whitelistMintSettings:d.data.whitelistMintSettings,hiddenSettings:d.data.hiddenSettings,price:d.data.price}});case 12:case"end":return e.stop()}}),e)})));return function(t,n,a){return e.apply(this,arguments)}}()}).call(this,n(13).Buffer)},160:function(e){e.exports=JSON.parse('{"version":"1.0.0","name":"magic_hat","instructions":[{"name":"initializeMagicHat","accounts":[{"name":"magicHat","isMut":true,"isSigner":false},{"name":"wallet","isMut":false,"isSigner":false},{"name":"authority","isMut":false,"isSigner":false},{"name":"payer","isMut":false,"isSigner":true},{"name":"systemProgram","isMut":false,"isSigner":false},{"name":"rent","isMut":false,"isSigner":false}],"args":[{"name":"data","type":{"defined":"MagicHatData"}}]},{"name":"updateMagicHat","accounts":[{"name":"magicHat","isMut":true,"isSigner":false},{"name":"authority","isMut":false,"isSigner":true},{"name":"wallet","isMut":false,"isSigner":false}],"args":[{"name":"data","type":{"defined":"MagicHatData"}}]},{"name":"updateAuthority","accounts":[{"name":"magicHat","isMut":true,"isSigner":false},{"name":"authority","isMut":false,"isSigner":true},{"name":"wallet","isMut":false,"isSigner":false}],"args":[{"name":"newAuthority","type":{"option":"publicKey"}}]},{"name":"addConfigLines","accounts":[{"name":"magicHat","isMut":true,"isSigner":false},{"name":"authority","isMut":false,"isSigner":true}],"args":[{"name":"index","type":"u32"},{"name":"configLines","type":{"vec":{"defined":"ConfigLine"}}}]},{"name":"setCollection","accounts":[{"name":"magicHat","isMut":true,"isSigner":false},{"name":"authority","isMut":false,"isSigner":true},{"name":"collectionPda","isMut":true,"isSigner":false},{"name":"payer","isMut":false,"isSigner":true},{"name":"systemProgram","isMut":false,"isSigner":false},{"name":"rent","isMut":false,"isSigner":false},{"name":"metadata","isMut":false,"isSigner":false},{"name":"mint","isMut":false,"isSigner":false},{"name":"edition","isMut":false,"isSigner":false},{"name":"collectionAuthorityRecord","isMut":true,"isSigner":false},{"name":"tokenMetadataProgram","isMut":false,"isSigner":false}],"args":[]},{"name":"removeCollection","accounts":[{"name":"magicHat","isMut":true,"isSigner":false},{"name":"authority","isMut":false,"isSigner":true},{"name":"collectionPda","isMut":true,"isSigner":false},{"name":"metadata","isMut":false,"isSigner":false},{"name":"mint","isMut":false,"isSigner":false},{"name":"collectionAuthorityRecord","isMut":true,"isSigner":false},{"name":"tokenMetadataProgram","isMut":false,"isSigner":false}],"args":[]},{"name":"mintNft","accounts":[{"name":"magicHat","isMut":true,"isSigner":false},{"name":"magicHatCreator","isMut":false,"isSigner":false},{"name":"payer","isMut":false,"isSigner":true},{"name":"wallet","isMut":true,"isSigner":false},{"name":"metadata","isMut":true,"isSigner":false},{"name":"mint","isMut":true,"isSigner":false},{"name":"mintAuthority","isMut":false,"isSigner":true},{"name":"updateAuthority","isMut":false,"isSigner":true},{"name":"masterEdition","isMut":true,"isSigner":false},{"name":"tokenMetadataProgram","isMut":false,"isSigner":false},{"name":"tokenProgram","isMut":false,"isSigner":false},{"name":"systemProgram","isMut":false,"isSigner":false},{"name":"rent","isMut":false,"isSigner":false},{"name":"clock","isMut":false,"isSigner":false},{"name":"recentBlockhashes","isMut":false,"isSigner":false},{"name":"instructionSysvarAccount","isMut":false,"isSigner":false}],"args":[{"name":"creatorBump","type":"u8"}]},{"name":"wlMintNft","accounts":[{"name":"magicHat","isMut":true,"isSigner":false},{"name":"walletWhitelist","isMut":true,"isSigner":false},{"name":"magicHatCreator","isMut":false,"isSigner":false},{"name":"whitelistedAddress","isMut":false,"isSigner":true},{"name":"wallet","isMut":true,"isSigner":false},{"name":"metadata","isMut":true,"isSigner":false},{"name":"mint","isMut":true,"isSigner":false},{"name":"mintAuthority","isMut":false,"isSigner":true},{"name":"updateAuthority","isMut":false,"isSigner":true},{"name":"masterEdition","isMut":true,"isSigner":false},{"name":"tokenMetadataProgram","isMut":false,"isSigner":false},{"name":"tokenProgram","isMut":false,"isSigner":false},{"name":"systemProgram","isMut":false,"isSigner":false},{"name":"rent","isMut":false,"isSigner":false},{"name":"clock","isMut":false,"isSigner":false},{"name":"recentBlockhashes","isMut":false,"isSigner":false},{"name":"instructionSysvarAccount","isMut":false,"isSigner":false}],"args":[{"name":"creatorBump","type":"u8"}]},{"name":"setCollectionDuringMint","accounts":[{"name":"magicHat","isMut":false,"isSigner":false},{"name":"metadata","isMut":false,"isSigner":false},{"name":"payer","isMut":false,"isSigner":true},{"name":"collectionPda","isMut":true,"isSigner":false},{"name":"tokenMetadataProgram","isMut":false,"isSigner":false},{"name":"instructions","isMut":false,"isSigner":false},{"name":"collectionMint","isMut":false,"isSigner":false},{"name":"collectionMetadata","isMut":false,"isSigner":false},{"name":"collectionMasterEdition","isMut":false,"isSigner":false},{"name":"authority","isMut":false,"isSigner":false},{"name":"collectionAuthorityRecord","isMut":false,"isSigner":false}],"args":[]},{"name":"withdrawFunds","accounts":[{"name":"magicHat","isMut":true,"isSigner":false},{"name":"authority","isMut":false,"isSigner":true}],"args":[]},{"name":"createWhitelistAccount","accounts":[{"name":"walletWhitelist","isMut":true,"isSigner":false},{"name":"whitelistConfig","isMut":false,"isSigner":false},{"name":"whitelistedAddress","isMut":false,"isSigner":false},{"name":"magicHatCreator","isMut":true,"isSigner":true},{"name":"systemProgram","isMut":false,"isSigner":false}],"args":[{"name":"whitelistType","type":"string"}]},{"name":"deleteWhitelistAccount","accounts":[{"name":"walletWhitelist","isMut":true,"isSigner":false},{"name":"magicHatCreator","isMut":true,"isSigner":true}],"args":[]},{"name":"createWhitelistConfig","accounts":[{"name":"whitelistConfig","isMut":true,"isSigner":false},{"name":"magicHatCreator","isMut":true,"isSigner":true},{"name":"systemProgram","isMut":false,"isSigner":false}],"args":[{"name":"wlStartTime4WlSpots","type":"u64"},{"name":"wlStartTime4WlMp","type":"u64"},{"name":"wlStartTime4WlSt","type":"u64"},{"name":"wlStartTime3WlSpots","type":"u64"},{"name":"wlStartTime3WlMp","type":"u64"},{"name":"wlStartTime3WlSt","type":"u64"},{"name":"wlStartTime2WlSpots","type":"u64"},{"name":"wlStartTime2WlMp","type":"u64"},{"name":"wlStartTime2WlSt","type":"u64"},{"name":"wlStartTime1WlSpots","type":"u64"},{"name":"wlStartTime1WlMp","type":"u64"},{"name":"wlStartTime1WlSt","type":"u64"}]},{"name":"deleteWhitelistConfig","accounts":[{"name":"whitelistConfig","isMut":true,"isSigner":false},{"name":"magicHatCreator","isMut":true,"isSigner":true}],"args":[]},{"name":"updateWhitelistConfig","accounts":[{"name":"whitelistConfig","isMut":true,"isSigner":false},{"name":"magicHatCreator","isMut":false,"isSigner":true}],"args":[{"name":"wlStartTime4WlSpots","type":"u64"},{"name":"wlStartTime4WlMp","type":"u64"},{"name":"wlStartTime4WlSt","type":"u64"},{"name":"wlStartTime3WlSpots","type":"u64"},{"name":"wlStartTime3WlMp","type":"u64"},{"name":"wlStartTime3WlSt","type":"u64"},{"name":"wlStartTime2WlSpots","type":"u64"},{"name":"wlStartTime2WlMp","type":"u64"},{"name":"wlStartTime2WlSt","type":"u64"},{"name":"wlStartTime1WlSpots","type":"u64"},{"name":"wlStartTime1WlMp","type":"u64"},{"name":"wlStartTime1WlSt","type":"u64"}]}],"accounts":[{"name":"MagicHat","type":{"kind":"struct","fields":[{"name":"authority","type":"publicKey"},{"name":"wallet","type":"publicKey"},{"name":"tokenMint","type":{"option":"publicKey"}},{"name":"itemsRedeemed","type":"u64"},{"name":"data","type":{"defined":"MagicHatData"}}]}},{"name":"CollectionPDA","type":{"kind":"struct","fields":[{"name":"mint","type":"publicKey"},{"name":"magicHat","type":"publicKey"}]}},{"name":"WalletWhitelist","type":{"kind":"struct","fields":[{"name":"magicHatCreator","type":"publicKey"},{"name":"whitelistedAddress","type":"publicKey"},{"name":"whitelistType","type":{"defined":"WLType"}},{"name":"numberOfWhitelistSpotsPerUser","type":"u64"},{"name":"discountedMintPrice","type":"u64"},{"name":"whitelistMintStartTime","type":"u64"}]}},{"name":"WhitelistConfig","type":{"kind":"struct","fields":[{"name":"whitelistSchedule","type":{"defined":"WhitelistSchedule"}},{"name":"magicHatCreator","type":"publicKey"}]}}],"types":[{"name":"MagicHatData","type":{"kind":"struct","fields":[{"name":"uuid","type":"string"},{"name":"price","type":"u64"},{"name":"symbol","type":"string"},{"name":"sellerFeeBasisPoints","type":"u16"},{"name":"maxSupply","type":"u64"},{"name":"isMutable","type":"bool"},{"name":"retainAuthority","type":"bool"},{"name":"goLiveDate","type":{"option":"i64"}},{"name":"endSettings","type":{"option":{"defined":"EndSettings"}}},{"name":"creators","type":{"vec":{"defined":"Creator"}}},{"name":"hiddenSettings","type":{"option":{"defined":"HiddenSettings"}}},{"name":"whitelistMintSettings","type":{"option":{"defined":"WhitelistMintSettings"}}},{"name":"itemsAvailable","type":"u64"},{"name":"gatekeeper","type":{"option":{"defined":"GatekeeperConfig"}}}]}},{"name":"ConfigLine","type":{"kind":"struct","fields":[{"name":"name","type":"string"},{"name":"uri","type":"string"}]}},{"name":"EndSettings","type":{"kind":"struct","fields":[{"name":"endSettingType","type":{"defined":"EndSettingType"}},{"name":"number","type":"u64"}]}},{"name":"Creator","type":{"kind":"struct","fields":[{"name":"address","type":"publicKey"},{"name":"verified","type":"bool"},{"name":"share","type":"u8"}]}},{"name":"HiddenSettings","type":{"kind":"struct","fields":[{"name":"name","type":"string"},{"name":"uri","type":"string"},{"name":"hash","type":{"array":["u8",32]}}]}},{"name":"WhitelistMintSettings","type":{"kind":"struct","fields":[{"name":"mode","type":{"defined":"WhitelistMintMode"}},{"name":"mint","type":"publicKey"},{"name":"presale","type":"bool"},{"name":"discountPrice","type":{"option":"u64"}}]}},{"name":"GatekeeperConfig","type":{"kind":"struct","fields":[{"name":"gatekeeperNetwork","type":"publicKey"},{"name":"expireOnUse","type":"bool"}]}},{"name":"WhitelistTierConfig","type":{"kind":"struct","fields":[{"name":"whitelistType","type":{"defined":"WLType"}},{"name":"numberOfWhitelistSpotsTotal","type":"u64"},{"name":"discountedMintPrice","type":"u64"},{"name":"whitelistMintStartTime","type":"u64"}]}},{"name":"WhitelistSchedule","type":{"kind":"struct","fields":[{"name":"wlStartTime4","type":{"defined":"WhitelistTierConfig"}},{"name":"wlStartTime3","type":{"defined":"WhitelistTierConfig"}},{"name":"wlStartTime2","type":{"defined":"WhitelistTierConfig"}},{"name":"wlStartTime1","type":{"defined":"WhitelistTierConfig"}}]}},{"name":"EndSettingType","type":{"kind":"enum","variants":[{"name":"Date"},{"name":"Amount"}]}},{"name":"WhitelistMintMode","type":{"kind":"enum","variants":[{"name":"BurnEveryTime"},{"name":"NeverBurn"}]}},{"name":"WLType","type":{"kind":"enum","variants":[{"name":"Null"},{"name":"One"},{"name":"Two"},{"name":"Three"},{"name":"Four"}]}}],"errors":[{"code":6000,"name":"IncorrectOwner","msg":"Account does not have correct owner!"},{"code":6001,"name":"Uninitialized","msg":"Account is not initialized!"},{"code":6002,"name":"MintMismatch","msg":"Mint Mismatch!"},{"code":6003,"name":"IndexGreaterThanLength","msg":"Index greater than length!"},{"code":6004,"name":"NumericalOverflowError","msg":"Numerical overflow error!"},{"code":6005,"name":"TooManyCreators","msg":"Can only provide up to 4 creators to magic hat (because magic hat is one)!"},{"code":6006,"name":"UuidMustBeExactly6Length","msg":"Uuid must be exactly of 6 length"},{"code":6007,"name":"NotEnoughTokens","msg":"Not enough tokens to pay for this minting"},{"code":6008,"name":"NotEnoughSOL","msg":"Not enough SOL to pay for this minting"},{"code":6009,"name":"TokenTransferFailed","msg":"Token transfer failed"},{"code":6010,"name":"MagicHatEmpty","msg":"Magic hat is empty!"},{"code":6011,"name":"MagicHatNotLive","msg":"Magic hat is not live!"},{"code":6012,"name":"HiddenSettingsConfigsDoNotHaveConfigLines","msg":"Configs that are using hidden uris do not have config lines, they have a single hash representing hashed order"},{"code":6013,"name":"CannotChangeNumberOfLines","msg":"Cannot change number of lines unless is a hidden config"},{"code":6014,"name":"DerivedKeyInvalid","msg":"Derived key invalid"},{"code":6015,"name":"PublicKeyMismatch","msg":"Public key mismatch"},{"code":6016,"name":"NoWhitelistToken","msg":"No whitelist token present"},{"code":6017,"name":"TokenBurnFailed","msg":"Token burn failed"},{"code":6018,"name":"GatewayAppMissing","msg":"Missing gateway app when required"},{"code":6019,"name":"GatewayTokenMissing","msg":"Missing gateway token when required"},{"code":6020,"name":"GatewayTokenExpireTimeInvalid","msg":"Invalid gateway token expire time"},{"code":6021,"name":"NetworkExpireFeatureMissing","msg":"Missing gateway network expire feature when required"},{"code":6022,"name":"CannotFindUsableConfigLine","msg":"Unable to find an unused config line near your random number index"},{"code":6023,"name":"InvalidString","msg":"Invalid string"},{"code":6024,"name":"SuspiciousTransaction","msg":"Suspicious transaction detected"},{"code":6025,"name":"CannotSwitchToHiddenSettings","msg":"Cannot Switch to Hidden Settings after items available is greater than 0"},{"code":6026,"name":"IncorrectSlotHashesPubkey","msg":"Incorrect SlotHashes PubKey"},{"code":6027,"name":"IncorrectCollectionAuthority","msg":"Incorrect collection NFT authority"},{"code":6028,"name":"MismatchedCollectionPDA","msg":"Collection PDA address is invalid"},{"code":6029,"name":"MismatchedCollectionMint","msg":"Provided mint account doesn\'t match collection PDA mint"},{"code":6030,"name":"SlotHashesEmpty","msg":"Slot hashes Sysvar is empty"},{"code":6031,"name":"MetadataAccountMustBeEmpty","msg":"The metadata account has data in it, and this must be empty to mint a new NFT"},{"code":6032,"name":"MissingSetCollectionDuringMint","msg":"Missing set collection during mint IX for Magic hat with collection set"},{"code":6033,"name":"NoChangingCollectionDuringMint","msg":"Can\'t change collection settings after items have begun to be minted"},{"code":6034,"name":"MagicHatCollectionRequiresRetainAuthority","msg":"Retain authority must be true for Magic hats with a collection set"},{"code":6035,"name":"NotEnoughBalance","msg":"Src Balance < LP Deposit Amount."},{"code":6036,"name":"InvalidNumberofWL","msg":"Can\'t decerease as the count is more than number of available spots."},{"code":6037,"name":"InvalidWLType","msg":"WLType is invalid."},{"code":6038,"name":"WL1NotScheduled","msg":"WL1 not scheduled."},{"code":6039,"name":"WL2NotScheduled","msg":"WL2 not scheduled."},{"code":6040,"name":"WL3NotScheduled","msg":"WL3 not scheduled."},{"code":6041,"name":"WL4NotScheduled","msg":"WL4 not scheduled."},{"code":6042,"name":"WLMintNotStarted","msg":"WL mint not started yet."},{"code":6043,"name":"NoWhitelistSpots","msg":"No whitelist spots left"}],"metadata":{"address":"JBw14YzhNTQGqUX54MatDgxDrCPopKf4EGcJHoHfq5ha"}}')},176:function(e,t,n){},177:function(e,t){},179:function(e,t){},203:function(e,t){},204:function(e,t){},232:function(e,t,n){"use strict";n.r(t);var a=n(1),i=n(23),s=n.n(i),r=(n(176),n(17)),c=n(8),o=n(2),l=n(10),u=n(0),m=n.n(u),d=n(276),g=n(274),f=n(151),p=n(112),h=n(159),b=(n(229),n(129)),y=n.n(b),S=n(15),j=(new r.d.PublicKey("JBw14YzhNTQGqUX54MatDgxDrCPopKf4EGcJHoHfq5ha"),function(e){var t=Object(a.useState)(!1),n=Object(l.a)(t,2),i=(n[0],n[1],Object(a.useState)()),s=Object(l.a)(i,2),r=(s[0],s[1]),u=Object(a.useState)({open:!1,message:"",severity:void 0}),b=Object(l.a)(u,2),j=b[0],w=b[1],v=Object(a.useState)("main-bg-after-door-open black-bg"),M=Object(l.a)(v,2),x=M[0],O=(M[1],Object(a.useState)(!1)),T=Object(l.a)(O,2),k=(T[0],T[1]),P=Object(a.useState)(!1),C=(Object(l.a)(P,1)[0],Object(a.useState)(!0)),N=Object(l.a)(C,2),W=(N[0],N[1]),A=Object(a.useState)(null),D=Object(l.a)(A,2),H=(D[0],D[1],Object(a.useState)(null)),K=Object(l.a)(H,2),E=K[0],R=(K[1],Object(a.useState)(0)),L=Object(l.a)(R,2),B=(L[0],L[1]),_=Object(a.useState)(1),q=Object(l.a)(_,2),F=(q[0],q[1],Object(a.useState)("")),I=Object(l.a)(F,2),G=I[0],V=(I[1],Object(a.useState)("")),z=Object(l.a)(V,2),J=(z[0],z[1],Object(a.useState)(!1)),Q=Object(l.a)(J,2),Z=Q[0],U=Q[1],Y=Object(a.useState)(!1),X=Object(l.a)(Y,2),$=X[0],ee=X[1],te=Object(a.useState)(1),ne=Object(l.a)(te,2),ae=ne[0],ie=ne[1],se=Object(f.b)();se.connect();var re=Object(a.useMemo)((function(){if(se&&se.publicKey&&se.signAllTransactions&&se.signTransaction)return{publicKey:se.publicKey,signAllTransactions:se.signAllTransactions,signTransaction:se.signTransaction}}),[se]),ce=Object(a.useCallback)(Object(o.a)(m.a.mark((function t(){var n,a,i,s;return m.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(re){t.next=2;break}return t.abrupt("return");case 2:if(!e.magicHatId){t.next=19;break}return t.prev=3,t.next=6,Object(h.a)(re,e.magicHatId,e.connection);case 6:n=t.sent,console.log(JSON.stringify(n.state,null,4)),a=null===n||void 0===n?void 0:n.state.itemsRedeemed.toString(),i=null===n||void 0===n?void 0:n.state.itemsAvailable.toString(),s=(parseInt(a)/parseInt(i)*100).toFixed(0),B(s),r(n),t.next=19;break;case 15:t.prev=15,t.t0=t.catch(3),console.log("There was a problem fetching Candy Machine state"),console.log(t.t0);case 19:case"end":return t.stop()}}),t,null,[[3,15]])}))),[re,e.magicHatId,e.connection]);Object(a.useEffect)((function(){document.getElementById("main").clientWidth<480&&k(!0),setTimeout((function(){W(!1)}),900)}),[re,e.magicHatId,e.connection,ce,se,E,G]);var oe=function(){var e=Object(o.a)(m.a.mark((function e(t){return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:ie(t);case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return Object(S.jsxs)("div",{id:"main",className:x,children:[Object(S.jsx)("div",{className:"pull-left full-width",children:se&&se.connected?Object(S.jsx)("div",{className:"after-connect-div",children:Object(S.jsxs)("div",{className:"launch-collection-div",children:[Object(S.jsx)("h2",{className:"launch-collection-title",children:"Launch Collection"}),Object(S.jsxs)("div",{className:"Main-collection-upload-steps",children:[Object(S.jsx)("div",{onClick:function(){return oe(1)},className:1==ae?"upload-steps-header active-upload-steps-header":"upload-steps-header",children:Object(S.jsxs)("label",{className:"",children:["Collection",Object(S.jsx)("br",{}),"Details"]})}),Object(S.jsx)("div",{onClick:function(){return oe(2)},className:2==ae?"upload-steps-header active-upload-steps-header":"upload-steps-header",children:Object(S.jsxs)("label",{className:"",children:["Upload",Object(S.jsx)("br",{}),"Images"]})}),Object(S.jsx)("div",{onClick:function(){return oe(3)},className:3==ae?"upload-steps-header active-upload-steps-header":"upload-steps-header",children:Object(S.jsxs)("label",{className:"",children:["Deploy",Object(S.jsx)("br",{}),"on chain"]})}),Object(S.jsx)("div",{onClick:function(){return oe(4)},className:4==ae?"upload-steps-header active-upload-steps-header last-child":"upload-steps-header last-child",children:Object(S.jsxs)("label",{className:"",children:["Mint",Object(S.jsx)("br",{}),"Button"]})}),1==ae&&Object(S.jsxs)("div",{className:"collection-details-parent",children:[Object(S.jsx)("div",{className:"collection-details-basic",children:Object(S.jsxs)("div",{className:"collection-details-basic-parent",children:[Object(S.jsx)("label",{children:"Collection Details"}),Object(S.jsx)("label",{className:"colection-details-label",children:"Collection Name"}),Object(S.jsx)("input",{placeholder:"Name",className:"collection-details-input"}),Object(S.jsx)("label",{className:"colection-details-label",children:"Symbol"}),Object(S.jsx)("input",{placeholder:"Symbol",className:"collection-details-input"}),Object(S.jsx)("label",{className:"colection-details-label",children:"Launch Date"}),Object(S.jsx)("input",{placeholder:"Symbol",type:"date",className:"collection-details-input"}),Object(S.jsx)("label",{className:"colection-details-label",children:"Reveal Later"}),Object(S.jsx)(y.a,{height:24,width:50,onColor:"#2948ff",onChange:function(){return U(!Z)},checked:Z}),Object(S.jsx)("label",{className:"colection-details-label",children:"Freeze Collection"}),Object(S.jsx)(y.a,{height:24,width:50,onColor:"#2948ff",onChange:function(){return ee(!$)},checked:$})]})}),Object(S.jsx)("div",{className:"collection-details-nft",children:Object(S.jsxs)("div",{className:"collection-details-nft-parent",children:[Object(S.jsxs)("div",{className:"nft-details-first",children:[Object(S.jsx)("label",{children:"NFT Details"}),Object(S.jsx)("label",{className:"colection-details-label",children:"Base Art Name"}),Object(S.jsx)("input",{placeholder:"NFT #",className:"collection-details-input"}),Object(S.jsx)("label",{className:"colection-details-label",children:"Description"}),Object(S.jsx)("textarea",{placeholder:"Symbol",className:"collection-details-textarea"}),Object(S.jsxs)("div",{className:"hlaf-div",children:[Object(S.jsx)("label",{className:"colection-details-label",children:"Mint Cost"}),Object(S.jsx)("input",{placeholder:"0.05",type:"number",pattern:"[0-9]+([.,][0-9]+)?",step:"0.01",className:"collection-details-input"})]}),Object(S.jsxs)("div",{className:"hlaf-div",children:[Object(S.jsx)("label",{className:"colection-details-label",children:"Royalities"}),Object(S.jsx)("input",{placeholder:"2.5",type:"number",pattern:"[0-9]+([.,][0-9]+)?",step:"0.01",className:"collection-details-input"})]})]}),Object(S.jsx)("div",{className:"nft-details-second",children:Object(S.jsx)("label",{children:"Preview"})})]})})]})]})]})}):Object(S.jsx)("div",{className:"connect-wallet-div",children:Object(S.jsx)(p.a,{className:"Connect-Wallet-btn",children:"Connect Wallet"})})}),Object(S.jsx)(d.a,{className:"snack-bar",open:j.open,autoHideDuration:6e3,onClose:function(){return w(Object(c.a)(Object(c.a)({},j),{},{open:!1}))},children:Object(S.jsx)(g.a,{className:"bold",onClose:function(){return w(Object(c.a)(Object(c.a)({},j),{},{open:!1}))},severity:j.severity,children:j.message})})]})}),w=n(4),v=n(277),M=n(278),x=n(279),O=n(270),T=n(271),k=n(280),P=n(275),C=n(162),N=n(272),W=Object(C.a)({palette:{type:"dark"}}),A=function(){try{var e=new r.d.PublicKey("86Yz2W2gh8gyupVhGuX9VxhNV6JoGQqD3RZzixajc4TZ");return console.log(e),e}catch(t){return void console.log("Failed to construct MagicHatId",t)}}(),D="devnet",H=Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0,REACT_APP_MAGIC_HAT_ID:"86Yz2W2gh8gyupVhGuX9VxhNV6JoGQqD3RZzixajc4TZ",REACT_APP_SOLANA_NETWORK:"devnet"}).REACT_APP_SOLANA_RPC_HOST,K=new r.d.Connection(H||r.d.clusterApiUrl("devnet")),E=parseInt(Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0,REACT_APP_MAGIC_HAT_ID:"86Yz2W2gh8gyupVhGuX9VxhNV6JoGQqD3RZzixajc4TZ",REACT_APP_SOLANA_NETWORK:"devnet"}).REACT_APP_CANDY_START_DATE,10),R=function(){var e=Object(a.useMemo)((function(){return Object(w.clusterApiUrl)(D)}),[]),t=Object(a.useMemo)((function(){return[Object(v.a)(),Object(M.a)(),Object(x.a)(),Object(O.a)({network:D}),Object(T.a)({network:D})]}),[]);return Object(S.jsx)(N.a,{theme:W,children:Object(S.jsx)(k.a,{endpoint:e,children:Object(S.jsx)(P.a,{wallets:t,autoConnect:!0,children:Object(S.jsx)(p.b,{children:Object(S.jsx)(j,{magicHatId:A,connection:K,startDate:E,txTimeout:3e4,rpcHost:H})})})})})},L=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,281)).then((function(t){var n=t.getCLS,a=t.getFID,i=t.getFCP,s=t.getLCP,r=t.getTTFB;n(e),a(e),i(e),s(e),r(e)}))};s.a.render(Object(S.jsx)(R,{}),document.getElementById("root")),L()},28:function(e,t,n){"use strict";n.d(t,"c",(function(){return i})),n.d(t,"a",(function(){return s})),n.d(t,"b",(function(){return r}));var a=n(4),i=(new a.PublicKey("JBw14YzhNTQGqUX54MatDgxDrCPopKf4EGcJHoHfq5ha"),new a.PublicKey("H18mLh2oW73KBqRZ53La54qBafEaXBm9bXVefhKnMfXH"),new a.PublicKey("CMftun186ypSsjsZM8eVfDA7AsPZLoScWpTEYBvCzZVQ"),new a.PublicKey("78yzdAb2quRrZWgQi114jdJrsroscWfV3AdVDQYsTFt8"),new a.PublicKey("78yzdAb2quRrZWgQi114jdJrsroscWfV3AdVDQYsTFt8"),new a.PublicKey("78yzdAb2quRrZWgQi114jdJrsroscWfV3AdVDQYsTFt8"),new a.PublicKey("78yzdAb2quRrZWgQi114jdJrsroscWfV3AdVDQYsTFt8"),new a.PublicKey("78yzdAb2quRrZWgQi114jdJrsroscWfV3AdVDQYsTFt8"),new a.PublicKey("78yzdAb2quRrZWgQi114jdJrsroscWfV3AdVDQYsTFt8"),new a.PublicKey("F4SDKmdyr6pzESeRuew4CkWj2qpTZ1xbn6o7Bvsa9297"),new a.PublicKey("x4zmbszSajZe8Qg8H1J9s1hMsrDTYjPDe4qp8fJcgMa"),new a.PublicKey("Bi4UpEtKxnHwCw7b9xkMCouGT6xLNm8nixs2fTmxTevs"),new a.PublicKey("BNZy4DXcGZRpkkgnQn5nfqnkMPjjh7NLk1KBTe8qqtmZ"),new a.PublicKey("SysvarC1ock11111111111111111111111111111111"),new a.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")),s=(new a.PublicKey("SysvarEpochSchedu1e111111111111111111111111"),new a.PublicKey("Sysvar1nstructions1111111111111111111111111"),new a.PublicKey("SysvarRecentB1ockHashes11111111111111111111"),new a.PublicKey("SysvarRent111111111111111111111111111111111"),new a.PublicKey("SysvarRewards111111111111111111111111111111"),new a.PublicKey("SysvarRecentB1ockHashes11111111111111111111"),new a.PublicKey("SysvarS1otHistory11111111111111111111111111"),new a.PublicKey("SysvarStakeHistory1111111111111111111111111"),new a.PublicKey("86Yz2W2gh8gyupVhGuX9VxhNV6JoGQqD3RZzixajc4TZ")),r=(new a.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),new a.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"));Object(a.clusterApiUrl)("devnet")},40:function(e,t,n){"use strict";(function(e){n.d(t,"a",(function(){return l})),n.d(t,"b",(function(){return u})),n.d(t,"c",(function(){return m})),n.d(t,"d",(function(){return d}));var a=n(2),i=n(0),s=n.n(i),r=n(17),c=n(32),o=(n(4),new Intl.NumberFormat("en-US",{style:"decimal",minimumFractionDigits:2,maximumFractionDigits:2}),new r.d.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL")),l=new r.d.PublicKey("gatem74V238djXdzWnJf94Wo1DcnuGkfijbf3AuBhfs"),u=function(){var e=Object(a.a)(s.a.mark((function e(t,n){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.d.PublicKey.findProgramAddress([n.toBuffer(),c.b.toBuffer(),t.toBuffer()],o);case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),m=function(){var t=Object(a.a)(s.a.mark((function t(n){return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,r.d.PublicKey.findProgramAddress([n.toBuffer(),e.from("expire")],l);case 2:return t.abrupt("return",t.sent);case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),d=function(){var t=Object(a.a)(s.a.mark((function t(n,a){return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,r.d.PublicKey.findProgramAddress([n.toBuffer(),e.from("gateway"),e.from([0,0,0,0,0,0,0,0]),a.toBuffer()],l);case 2:return t.abrupt("return",t.sent);case 3:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}()}).call(this,n(13).Buffer)}},[[232,1,2]]]);
//# sourceMappingURL=main.d3a1f3ff.chunk.js.map