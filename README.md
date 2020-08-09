# automobile_supply_chain_using Blockchain

About The Applicartion :

This is an automobile supply chain consistsing of Suppliers, Manufacturers, Distributor and Customers.
A) Supplier Functions :
                   1) Add a new Cart Part : A Supplier can add a new car part like brake, wheel etc along with their product ids, product name, price, MFG location.
                   2) View Car Parts : The Supplier can view the parts owned by him / her.
B) Manufacturer Functions: 
                   1) View Parts : As Ethereum Blockchain is a private network everybody knows each other...so a manufactuer can see the parts supplied by a supplier after                                          entering the supplier address.
                   2) Buy Parts : A manufacturer can buy a new part from a supplier after entering the seller address(Supplier address) and product Ids which is known when he                                     clicks on the view part
                   3) Build Car : A manufactuer can build a car after buying all the parts from the suppler...here we only consider 4 parts.
                   4) Track Parts : Only after buying a car a mnaufactuer can view the origin of the parts which he has used to build a car after entering the vehicle number of                                     the car.
C) Dealer Functions :
                  1) View Cars : A dealer can see all the available cars of a particular manufacturer only after entering the manufacturing address and from that he / she can get the Vehicle number of the car.
                  2) Buy Car : A dealer can buy a car from a manufacturer.
 D) Customer Fucntions:
                  1) View Cars : A customer can see the various cars available under the different dealers.
                  2) Buy Car : A customer can buy a car from the dealer by entering the seller address.
                  3) Car Provenance : A customer can track the cars as well as car parts from supplier to manufacturer to dealer (For e.g. from where the parts were coming from,                                       who supplies the parts, etc.etc.)
  

Note : Here the unit of exchange is Ether (i.e. car price, part price all are in ether).

Technologies used :
              1) Truffle framework (For Dapp)
              2) Solidity (For Smnart Contract)
              3) Web3.js (Javascript API : Interacting with the local bLockchain)
              4) Ganache (Local Blockchain)
              5) Metamask (Browser plugin to run Ethereum local blockchain in Chrome)
              
