import Func "mo:base/Func";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";

import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Result "mo:base/Result";
import Debug "mo:base/Debug";

actor {
  // Define the TaxPayer type
  type TaxPayer = {
    tid: Nat;
    firstName: Text;
    lastName: Text;
    address: Text;
  };

  // Create a stable variable to store taxpayer records
  private stable var taxpayerEntries : [(Nat, TaxPayer)] = [];
  private var taxpayers = HashMap.HashMap<Nat, TaxPayer>(0, Nat.equal, Nat.hash);

  // Create a mutable variable to keep track of the next available TID
  private stable var nextTid : Nat = 1;

  // Function to add a new taxpayer
  public func addTaxPayer(firstName: Text, lastName: Text, address: Text) : async Result.Result<Nat, Text> {
    let tid = nextTid;
    let newTaxPayer : TaxPayer = {
      tid = tid;
      firstName = firstName;
      lastName = lastName;
      address = address;
    };
    taxpayers.put(tid, newTaxPayer);
    nextTid += 1;
    #ok(tid)
  };

  // Function to get all taxpayers
  public query func getTaxPayers() : async [TaxPayer] {
    Array.map<(Nat, TaxPayer), TaxPayer>(Iter.toArray(taxpayers.entries()), func (_, taxpayer) = taxpayer)
  };

  // Function to search for a taxpayer by TID
  public query func searchTaxPayer(tid: Nat) : async ?TaxPayer {
    taxpayers.get(tid)
  };

  // Upgrade hooks
  system func preupgrade() {
    taxpayerEntries := Iter.toArray(taxpayers.entries());
  };

  system func postupgrade() {
    taxpayers := HashMap.fromIter<Nat, TaxPayer>(taxpayerEntries.vals(), 0, Nat.equal, Nat.hash);
    taxpayerEntries := [];
  };
}
