const functions = require('firebase-functions');
var admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);

var firestore = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
// exports.helloWorld = functions.https.onRequest((request, response) => {

//  response.send("Hello word function");

// });


// exports.helloWorldTow = functions.https.onRequest((request, response) => {

//  response.send("Hello word 2 function");

// });


// exports.helloWorldTree = functions.https.onRequest((request, response) => {

//  response.send("Hello word 3 function");

// }); 

//-----------------------------------------------------------------------
// exports.webhook = functions.https.onRequest((request, response) => {
    
//     response.send({
//         speech: "hello world response from webhook - changed"
//     });

// });

//-----------------------------------------------------------------------
// exports.webhook = functions.https.onRequest((request, response) => {
    
//     console.log("request.body.result.parameters: ", request.body.result.parameters);
//     // {
//     //     name: "john",
//     //     persons: "3"
//     // }

//     let params = request.body.result.parameters;

//     response.send({
//         speech:
//             `${params.givenName} your hotel booking request for ${params.RoomType} room is forwarded for
//              ${params.persons} persons, we will contact you on ${params.email} soon`
//     });
// });

//---------------------------------------------------------------------
exports.webhook = functions.https.onRequest((request, response) => {
    
    console.log("request.body.result.parameters: ", request.body.result.parameters);
    // {
    //     name: "john",
    //     persons: "3"
    //     ...
    // }
        
        switch (request.body.result.action) {

        case 'BookFood':

            let params = request.body.result.parameters;

            firestore.collection('orders').add(params)
                .then(() => {

                    response.send({
                        speech:
                            `${params.anyName} your order is \n ${params.CategoriOrder} ${params.menuListFood} ${params.categoriRasa} ${params.noBanyak} porsi \n\n  pesanan saudara ${params.anyName} sedang kami proses & akan kami antar ke meja ${params.foodFourtplace} ${params.noTabel} \n terima kasih ${params.anyNameList} sudah layanan kami`
                    });
                })
                .catch((e => {

                    console.log("error: ", e);

                    response.send({
                        speech: "something went wrong when writing on database"
                    });
                }))
            break;

        case 'countBooking':

            firestore.collection('orders').get()
                .then((querySnapshot) => {

                    var orders = [];
                    querySnapshot.forEach((doc) => { orders.push(doc.data()) });
                    // now orders have something like this [ {...}, {...}, {...} ]

                    response.send({
                        speech: `you have ${orders.length} orders, would you like to see them? (yes/no)`
                    });
                })
                .catch((err) => {
                    console.log('Error getting documents', err);

                    response.send({
                        speech: "something went wrong when reading from database"
                    })
                })

            break;

        case 'showBookings':

            firestore.collection('orders').get()
                .then((querySnapshot) => {

                    var orders = [];
                    querySnapshot.forEach((doc) => { orders.push(doc.data()) });
                    // now orders have something like this [ {...}, {...}, {...} ]

                    // converting array to speech
                    var speech = `here are your orders \n`;

                    orders.forEach((eachOrder, index) => {
                        speech += `number ${index + 1} is ${eachOrder.CategoriOrder} \n ${eachOrder.menuListFood} ${eachOrder.categoriRasa} = ${eachOrder.noBanyak} porsi \n atas nama = ${eachOrder.List} \n dimeja no ${eachOrder.noTabel} ${eachOrder.noTabel} `
                    })

                    response.send({
                        speech: speech
                    });
                })
                .catch((err) => {
                    console.log('Error getting documents', err);

                    response.send({
                        speech: "something went wrong when reading from database"
                    })
                })

            break;

        default:
            response.send({
                speech: "no action matched in webhook"
            })
    }
});