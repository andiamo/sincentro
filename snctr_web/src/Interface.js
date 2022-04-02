var Interface = function() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
    // https://css-tricks.com/how-to-use-the-web-share-api/

    // const urlBase = 'file:///Users/andres/code/sincentro/snctr_web/index.html';
    const urlBase = 'https://andrescolubri.net/sincentro/'
    // const urlBase = 'https://andrescolubri.net/sincentro-test/'

    
          createButton('COMPARTIR').position(width - 150, 0).size(130, 30).mousePressed(async () => {
            const urlText =  urlBase + '?peer=' + miID;
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

          var tagDiv;
          var showingQR = false;
          createButton('CREAR QR').position(width - 300, 0).size(130, 30).mousePressed(async () => {
            // https://github.com/kazuhikoarase/qrcode-generator
            
            if (showingQR) {
                tagDiv.remove();
                showingQR = false;
            } else {
                // make the HTML tag div:
                tagDiv = createDiv();
                // position it:
                tagDiv.position(width - 250, height - 250);

                const urlText =  urlBase + '?peer=' + miID;
                let qr = qrcode(0, 'L');
                qr.addData(urlText);
                qr.make();
                let qrImg = qr.createImgTag(5, 20, "qr code");
                tagDiv.html(qrImg);
                showingQR = true;
            }
            
            
          });
  }
  
  Interface.prototype = {
    mostrar: function() {

    },

  }