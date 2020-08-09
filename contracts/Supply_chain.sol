pragma solidity >=0.4.21 <0.7.0;

pragma experimental ABIEncoderV2;

contract Supply_chain{
     struct parts{
        string part_id;
        string part_name;
        uint part_weight;
        
        address owner;
        string mfg_date;
        uint price;
        string part_location;

        uint sl_no;
    }
    mapping(uint => parts) public parts_lists;
    uint public number_of_parts;

    struct buy_part_details{
        address buyer_address;
        address seller_address;
        string part_id;
        string transaction_date;
    }
    mapping(uint=>buy_part_details) public list_of_buy_part_details;
    uint public number_of_buyed_parts;

    struct car{
        string vin;
        string model_name;
        string mfg_location;
        string mfg_date;
        uint price;

        string engine_pid;
        string battery_pid;
        string brakes_pid;
        string wheels_pid;

        address owner;
        uint sl_no;
    }
    uint public number_of_cars;
    mapping(uint => car) public cars_lists;

    struct buy_car_details{
        address buyer_address;
        address seller_address;
        string vin;
        string transaction_date;
    }
    mapping(uint=>buy_car_details) public list_of_buy_car_details;
    uint public number_of_buyed_cars;

    constructor() public{
        number_of_parts = 0;
        number_of_buyed_parts = 0 ;
        number_of_cars = 0;
        number_of_buyed_cars = 0;
    }

    function addParts(string memory _partId,string memory  _partname, uint _partWeight,address _owner, string memory  _mfgDate, uint _price,string memory _location)public {
        number_of_parts = number_of_parts + 1;
        parts_lists[number_of_parts] = parts(_partId, _partname , _partWeight, _owner, _mfgDate,_price,_location, number_of_parts);
    }
    
    function buyParts(address payable _buyer,address payable _seller, string memory _partid,  string memory _trdate) public{
        number_of_buyed_parts = number_of_buyed_parts + 1;
        list_of_buy_part_details[number_of_buyed_parts] = buy_part_details(_buyer,_seller,_partid,_trdate);
        uint i = 1;
        uint x = 0;
        while(i<=number_of_parts){
            parts memory p = parts_lists[i];
            if(keccak256(abi.encodePacked(p.part_id)) == keccak256(abi.encodePacked(_partid))){
                p.owner = _buyer;
                parts_lists[i] = p;
                x = p.price;
                break;
            }
            i = i + 1;
        }
    }

    function buildCar(string memory _vin,string memory _model_name, string memory _mfg_location,string memory _mfg_date, 
                      uint _price, string memory _pid1, string memory _pid2, string memory _pid3, string memory _pid4, address _owner)
                       public{
        number_of_cars = number_of_cars + 1;
        cars_lists[number_of_cars] = car(_vin,_model_name,_mfg_location,_mfg_date,_price,_pid1,_pid2,_pid3,
                                        _pid4,_owner,number_of_cars);
    }

    function buyCar(address payable _buyer,address payable _seller, string memory _vin,  string memory _trdate1) public{
        number_of_buyed_cars = number_of_buyed_cars + 1;
        list_of_buy_car_details[number_of_buyed_cars] = buy_car_details(_buyer,_seller,_vin,_trdate1);
        uint i = 1;
        uint x = 0;
        while(i<=number_of_cars){
            car memory c = cars_lists[i];
            if(keccak256(abi.encodePacked(c.vin)) == keccak256(abi.encodePacked(_vin))){
                c.owner = _buyer;
                cars_lists[i] = c;
                x = c.price;
                break;
            }
            i = i + 1;
        }
    }
    
}