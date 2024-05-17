import { BaseResponse } from "common/models/base-response";
import { PrintForm, TypeList } from "..";
import { Status } from "../base-response";

export interface Deal {
    accountInfo: string;
    accountuid: string;
    addToInventory: number;
    contactinfo: string;
    contactuid: string;
    created: string;
    dateeffective: string;
    datepurchase: string;
    dealstatus: number;
    dealtype: number;
    differentSeller: 0 | 1;
    differentSellerInfo: string;
    differentSellerUID: string;
    extdata: DealExtData;
    inventoryinfo: string;
    inventorystatus: number;
    inventoryuid: string;
    itemuid: string;
    name: string;
    price: string;
    salesperson1uid: string;
    salesperson2uid: string;
    saletype: number;
    status: string;
    updated: string;
    useruid: string;
    warnOverdueDays: number;
}

export interface IndexedDealList extends TypeList {
    index: number;
}

export interface DealExtData {
    Agent_Address: string;
    Agent_Name: string;
    Agent_Phone_No: string;
    Class_of_License: string;
    Con_Acct_Num: string;
    Con_Amt_To_Finance: number;
    Con_Calc_Rate: number;
    Con_Final_Pmt: number;
    Con_First_Pmt_Date: number;
    Con_Grace_Period: number;
    Con_Int_Rate: number;
    Con_Is_Financed: number;
    Con_Is_RFC: number;
    Con_Late_Fee: number;
    Con_Late_Fee_Max: number;
    Con_Late_Percent: number;
    Con_Lease_Base_Payment: number;
    Con_Lease_Miles: number;
    Con_Lease_Overage: number;
    Con_Lease_Prop_Tax: number;
    Con_Lease_Purch_Option: number;
    Con_Lease_Taxes: number;
    Con_Lease_Termination_Fee: number;
    Con_Lease_Use_Tax: number;
    Con_Pmt_Amt: number;
    Con_Pmt_Freq: number;
    Con_RFC_Sent: number;
    Con_RFC_Sent_Date: number;
    Con_Solve_For: number;
    Con_Term: number;
    Con_Total_Interest: number;
    Con_Total_of_Pmts: number;
    Date_Acquired: number;
    Date_First_Operated: number;
    Dealer_Number: string;
    DismantledDate: number;
    DismantledSoldTo: string;
    Dismntl_Sold_Body: number;
    Dismntl_Sold_Body_To: string;
    Dismntl_Sold_Engine: number;
    Dismntl_Sold_Engine_To: string;
    Dismntl_Sold_Frame: number;
    Dismntl_Sold_Frame_To: string;
    Dismntl_Sold_Other: number;
    Dismntl_Sold_Other_To: string;
    Dismntl_Sold_Other_What: string;
    Dismntl_Sold_Transmission: number;
    Dismntl_Sold_Transmission_To: string;
    ERT_Submitted: number;
    Exchanged_Plate_Number: string;
    Exchanged_Plates: 0 | 1;
    First_Lien_Acct_Num: string;
    First_Lien_Address: string;
    First_Lien_City: string;
    First_Lien_Date: number;
    First_Lien_Lienholder_ID: string;
    First_Lien_Name: string;
    First_Lien_Phone_Num: string;
    First_Lien_State: string;
    First_Lien_Zip_Code: string;
    GAP_Company: string;
    HowFoundOut: string;
    Ins_AH: number;
    Ins_AH_J: number;
    Ins_AH_RATE_ID: number;
    Ins_AH_Retro: number;
    Ins_AH_S: number;
    Ins_AH_Term: string;
    Ins_AH_Wait: number;
    Ins_CL_J: number;
    Ins_CL_RATE_ID: number;
    Ins_CL_S: number;
    Ins_CL_Type: number;
    Ins_Col_Deduct: number;
    Ins_Comp_Deduct: number;
    Ins_IA: number;
    Ins_Liab_Limit1: number;
    Ins_Liab_Limit2: number;
    Ins_MR: number;
    Ins_MR_Term: string;
    Ins_Policy_Received: number;
    Ins_Prop_Limit: number;
    Insp_Emmissions_Check: number;
    Insp_Safety_Check: number;
    InspectionDate: number;
    InspectionNumber: string;
    Insurance_Co_Num: string;
    Insurance_Company: string;
    Insurance_Eff_Date: number;
    Insurance_Exp_Date: number;
    Insurance_Notes: string;
    Insurance_Rate_Table_ID: number;
    LastUploaded: number;
    LotNo: number;
    Notary_County: string;
    Notary_Expires: string;
    Notary_Name: string;
    Notary_State: string;
    OdomDigits: number;
    OdomInExcess: number;
    OdomNotActual: number;
    OdometerReading: string;
    Plate_Issue_Date: number;
    Plate_Issued: 0 | 1;
    Plate_Number: string;
    Plate_Transferred: 0 | 1;
    Policy_Number: string;
    Purch_From_Address: string;
    Purch_From_City: string;
    Purch_From_County: string;
    Purch_From_Name: string;
    Purch_From_State: string;
    Purch_From_Tax_ID: string;
    Purch_From_Zip_Code: string;
    Replace_Plate: 0 | 1;
    Replaced_Plate_Number: string;
    SaleID: string;
    Second_Lien_Acct_Num: string;
    Second_Lien_Address: string;
    Second_Lien_City: string;
    Second_Lien_Date: number;
    Second_Lien_Lienholder_ID: string;
    Second_Lien_Name: string;
    Second_Lien_Phone_Num: string;
    Second_Lien_State: string;
    Second_Lien_Zip_Code: string;
    Sent_To_Lender: number;
    TempTagDate: number;
    TempTagNumber: string;
    Title_Issue_Date: number;
    Title_Number: string;
    Title_Only: 0 | 1;
    Title_and_License: 0 | 1;
    Trade1_Allowance: string;
    Trade1_BodyStyle: string;
    Trade1_Color: string;
    Trade1_Lien_Address: string;
    Trade1_Lien_Contact: string;
    Trade1_Lien_Name: string;
    Trade1_Lien_Payoff: string;
    Trade1_Lien_Payoff_Good_Through: number;
    Trade1_Lien_Per_Diem: string;
    Trade1_Lien_Phone: string;
    Trade1_Make: string;
    Trade1_Mileage: string;
    Trade1_Model: string;
    Trade1_OdomInExcess: number;
    Trade1_OdomNotActual: number;
    Trade1_StockNum: string;
    Trade1_Title_Num: string;
    Trade1_Title_To: string;
    Trade1_Title_To_CID: string;
    Trade1_Title_To_Name: string;
    Trade1_Trade_ACV: string;
    Trade1_VID: string;
    Trade1_VIN: string;
    Trade1_Year: string;
    Trade2_Allowance: string;
    Trade2_BodyStyle: string;
    Trade2_Color: string;
    Trade2_Lien_Address: string;
    Trade2_Lien_Contact: string;
    Trade2_Lien_Name: string;
    Trade2_Lien_Payoff: string;
    Trade2_Lien_Payoff_Good_Through: number;
    Trade2_Lien_Per_Diem: string;
    Trade2_Lien_Phone: string;
    Trade2_Make: string;
    Trade2_Mileage: string;
    Trade2_Model: string;
    Trade2_OdomInExcess: number;
    Trade2_OdomNotActual: number;
    Trade2_StockNum: string;
    Trade2_Title_Num: string;
    Trade2_Title_To: string;
    Trade2_Title_To_CID: string;
    Trade2_Title_To_Name: string;
    Trade2_Trade_ACV: string;
    Trade2_VID: string;
    Trade2_VIN: string;
    Trade2_Year: string;
    Transferred_Expiration_Date: string;
    Transferred_Plate_Number: string;
    Vehicle_Has_Lien: number;
    Vehicle_Is_Leased: number;
    Warranty_Deductible: number;
    Warranty_Miles: string;
    Warranty_Name: string;
    Warranty_Notes: string;
    Warranty_Price: number;
    Warranty_Term: string;
    created: number;
    dealUID: string;
    deleted: number;
    itemUID: string;
    updated: number;
    userUID: string;
}

export interface DealFinance {
    ACCT_NetCheck: number;
    ACCT_XFER_Balance: number;
    AH: string;
    AHComm: number;
    AHCost: number;
    AHFigure: string;
    AHProfit: number;
    AccProfit: number;
    Accessory: string;
    AccessoryCost: number;
    AccessoryDesc: string;
    AccessoryXML: string;
    AcquisitionFee: string;
    AquisitionFeeCost: number;
    BHPHCollectedInterest: number;
    BalanceDue: string;
    BuyRate: number;
    BuyRateInterest: number;
    CL: string;
    CLComm: number;
    CLCost: number;
    CLFigure: string;
    CLProfit: number;
    CashDown: string;
    CashPrice: string;
    Comm1PaidCheck: string;
    Comm1PaidDate: number;
    Comm1Percentage: number;
    Comm2Checks: string;
    Comm2Options: number;
    Comm2PaidCheck: string;
    Comm2PaidDate: number;
    Comm2Percentage: number;
    CommChecks: string;
    CommMgrPercentage: number;
    Commission1: number;
    Commission2: number;
    CommissionMgr: number;
    DateCreated: number;
    Demo: number;
    Deposit: string;
    Depreciation: string;
    DiscountCost: number;
    DocFee: string;
    DueAtSigning: string;
    ERT: string;
    FeesDown: string;
    FirstPayment: string;
    Gap: string;
    GapComm: number;
    GapCost: number;
    GapProfit: number;
    Insurance: string;
    InterestOther: number;
    IntrProfit: number;
    LastUpdated: number;
    LicenseAndReg: string;
    Luxury: string;
    MISC1: string;
    MISC2: string;
    MISC3: string;
    MISC4: string;
    MISC5: string;
    MISC6: string;
    MISC7: string;
    MISC8: string;
    MISC9: string;
    MR: string;
    MRComm: number;
    MRCost: number;
    MRFigure: string;
    MRProfit: number;
    Misc: string;
    MiscCost: string;
    MiscCostDesc: string;
    MiscDesc: string;
    MiscProfit: string;
    MiscProfitDesc: string;
    MiscTaxable: string;
    MiscTaxableDesc: string;
    MiscTaxableXML: string;
    MiscXML: string;
    NONCAP1: string;
    NONCAP2: string;
    NONCAP3: string;
    NONCAP4: string;
    NONCAP5: string;
    NONCAP6: string;
    NONCAP7: string;
    NONCAP8: string;
    NONCAP9: string;
    NetTradeAllowance: string;
    NonCapWarranty: string;
    ORDER_ID: string;
    PackProfit: number;
    Predelivery: string;
    Profile: string;
    ProfitRealized: number;
    ProjInterest: number;
    PurchOption: string;
    Rebate: string;
    Reserve: number;
    ReserveCost: number;
    ReserveProfit: number;
    ReserveWitholding: number;
    Residual: string;
    ShowInterestAsProfit: number;
    SmogFee: string;
    SubTotal: string;
    Tags: string;
    Tax1Max: number;
    Tax1Rate: string;
    Tax2Lower: number;
    Tax2Max: number;
    Tax2Rate: string;
    Tax3Lower: number;
    Tax3Max: number;
    Tax3Rate: string;
    TaxRate: string;
    TaxableAmount: string;
    Taxes: string;
    TaxesXML: string;
    TireFee: string;
    Title: string;
    TotalCollected: number;
    TotalCollectedInterest: number;
    TotalCost: number;
    TotalDown: string;
    TotalExpInterest: number;
    TotalPrice: string;
    TotalProfit: number;
    TotalSoldPrice: string;
    TradeAllowance: string;
    TradeInPayoff: string;
    TradeProfit: number;
    VehicleProfit: number;
    Warranty: string;
    WarrantyComm: number;
    WarrantyCost: number;
    WarrantyProfit: number;
    created: number;
    dealUID: string;
    deleted: number;
    index: number;
    itemUID: string;
    status: Status;
    updated: number;
    userUID: string;
}

export interface DealPrintForm extends PrintForm {}

export type DealPrintFormResponse = BaseResponse & {
    [key: string]: DealPrintForm[];
};
