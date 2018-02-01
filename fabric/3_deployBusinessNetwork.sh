#!/usr/bin/env bash

composer runtime install --card PeerAdmin@hlfv1 --businessNetworkName greenfield-network
composer network start --card PeerAdmin@hlfv1 --networkAdmin admin --networkAdminEnrollSecret adminpw --archiveFile ../dist/greenfield-network.bna --file cards/networkadmin.card
composer card import --file cards/networkadmin.card
composer network ping --card admin@greenfield-network
