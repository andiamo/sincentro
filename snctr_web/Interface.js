var Interface = function() {
    // file:///Users/andres/code/sincentro/snctr_web/index.html?peer=8a853b72-ac5b-45d3-b03a-50a7845ce967

    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
    // https://css-tricks.com/how-to-use-the-web-share-api/
          const shareData = {
            title: 'SINCENTRO',
            text: 'Dibujemos juntos',
            url: 'file:///Users/andres/code/sincentro/snctr_web/index.html?peer=' + this.peerID,
          }    
    
          createButton('+').position(width - 50, 0).size(30, 30).mousePressed(async () => {
            if (navigator.share) {
              try {
                await navigator.share(shareData)
                print('MDN shared successfully');
                // resultPara.textContent = 'MDN shared successfully'
              } catch(err) {
                print('Error: ' + err);
                // resultPara.textContent = 'Error: ' + err
              }                
            } else {
                print('Share API not available in this browser');
            }

          });
  }
  
  Interface.prototype = {
    mostrar: function() {

    },

  }