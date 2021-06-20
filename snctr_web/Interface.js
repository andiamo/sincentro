var Interface = function() {
    // file:///Users/andres/code/sincentro/snctr_web/index.html?peer=8a853b72-ac5b-45d3-b03a-50a7845ce967

    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
    // https://css-tricks.com/how-to-use-the-web-share-api/

    
          createButton('+').position(width - 50, 0).size(30, 30).mousePressed(async () => {
            const urlText =  'file:///Users/andres/code/sincentro/snctr_web/index.html?peer=' + miID;
            print("======>", urlText);
  
            const shareData = {
              title: 'SINCENTRO',
              text: urlText,
            //   url: urlText,
            }

            if (navigator.share) {
              try {
                await navigator.share(shareData)
                print('url shared successfully');
                // resultPara.textContent = 'MDN shared successfully'
              } catch(err) {
                print('Error: ' + err);
                // resultPara.textContent = 'Error: ' + err
              }                
            } else if (navigator.clipboard) {
                // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
                print('Share API not available in this browser, will use clipboard');
                navigator.clipboard.writeText(urlText).then(function() {
                    /* clipboard successfully set */
                    print('Copied to clipboard');
                    mensajes.agregar("URL COPIADO AL PORTAPAPELES")
                  }, function() {
                    /* clipboard write failed */
                  });
            } else {
                print('cannot share');
            }

          });
  }
  
  Interface.prototype = {
    mostrar: function() {

    },

  }