#!/usr/bin/env bash

composer participant add -c admin@greenfield-network -d '{"$class":"com.trivadis.greenfield.Person","personId":"gnr","firstName":"Ralf","lastName":"Gnaedinger"}'
composer participant add -c admin@greenfield-network -d '{"$class":"com.trivadis.greenfield.Person","personId":"fmo","firstName":"Frank","lastName":"Mohn"}'
composer participant add -c admin@greenfield-network -d '{"$class":"com.trivadis.greenfield.Person","personId":"jog","firstName":"Johannes","lastName":"Goerge"}'
composer participant add -c admin@greenfield-network -d '{"$class":"com.trivadis.greenfield.Person","personId":"jow","firstName":"Joachim","lastName":"Wehner"}'
composer participant add -c admin@greenfield-network -d '{"$class":"com.trivadis.greenfield.Person","personId":"mbs","firstName":"Stefan","lastName":"Merkle-Bach"}'
composer participant add -c admin@greenfield-network -d '{"$class":"com.trivadis.greenfield.Person","personId":"url","firstName":"Urban","lastName":"Lankes"}'
composer participant add -c admin@greenfield-network -d '{"$class":"com.trivadis.greenfield.Person","personId":"msc","firstName":"Martin","lastName":"Schreiber"}'
composer participant add -c admin@greenfield-network -d '{"$class":"com.trivadis.greenfield.Person","personId":"soe","firstName":"Stefan","lastName":"Oehrli"}'
composer participant add -c admin@greenfield-network -d '{"$class":"com.trivadis.greenfield.Person","personId":"mze","firstName":"Markus","lastName":"Zehnder"}'
composer participant add -c admin@greenfield-network -d '{"$class":"com.trivadis.greenfield.Person","personId":"sor","firstName":"Martina","lastName":"Sordakis"}'

composer identity issue -c admin@greenfield-network -u gnr -a com.trivadis.greenfield.Person#gnr -f gnr@greenfield-network.card
composer identity issue -c admin@greenfield-network -u fmo -a com.trivadis.greenfield.Person#fmo -f fmo@greenfield-network.card
composer identity issue -c admin@greenfield-network -u jog -a com.trivadis.greenfield.Person#jog -f jog@greenfield-network.card
composer identity issue -c admin@greenfield-network -u jow -a com.trivadis.greenfield.Person#jow -f jow@greenfield-network.card
composer identity issue -c admin@greenfield-network -u mbs -a com.trivadis.greenfield.Person#mbs -f mbs@greenfield-network.card
composer identity issue -c admin@greenfield-network -u url -a com.trivadis.greenfield.Person#url -f url@greenfield-network.card
composer identity issue -c admin@greenfield-network -u msc -a com.trivadis.greenfield.Person#msc -f msc@greenfield-network.card
composer identity issue -c admin@greenfield-network -u soe -a com.trivadis.greenfield.Person#soe -f soe@greenfield-network.card
composer identity issue -c admin@greenfield-network -u mze -a com.trivadis.greenfield.Person#mze -f mze@greenfield-network.card
composer identity issue -c admin@greenfield-network -u sor -a com.trivadis.greenfield.Person#sor -f sor@greenfield-network.card

composer card import -f gnr@greenfield-network.card
composer card import -f fmo@greenfield-network.card
composer card import -f jog@greenfield-network.card
composer card import -f jow@greenfield-network.card
composer card import -f mbs@greenfield-network.card
composer card import -f url@greenfield-network.card
composer card import -f msc@greenfield-network.card
composer card import -f soe@greenfield-network.card
composer card import -f mze@greenfield-network.card
composer card import -f sor@greenfield-network.card
