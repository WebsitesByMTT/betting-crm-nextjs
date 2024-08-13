export interface Field {
  //Login Input Fields Type Interface
  type: string;
  placeholder: string;
  value?: string;
  Name: string;
  icon?: React.ReactNode;
}

export interface FormData {
  // Login Input Values Type
  username: string;
  password: string;
  [key: string]: string | undefined;
  captchaToken:string
  captcha:string
}

export interface DecodeToken{
  role:any;
}


// Define an interface for the structure of each item in the TopCards array
export interface TopCardItem {
  Text?: string;
  counts?: string;
  percentage?: string;
  arrow?: JSX.Element;
}

interface GlobleState {
  showNotification: boolean;
}

export interface RootState {
  globlestate: GlobleState;
}

// Interface for the individual row data
interface RowDataType {
  userName: string;
  Status: string;
  Credits: string;
  TotalBets: string;
  TotalRecharge: string;
  TotalReddem: string;
  Action: React.ReactNode;
}

// Interface for the overall table data structure
interface TableDataType {
  Thead: string[];
  Tbody: RowDataType[];
}

// Props interface for the Table component
export interface TableProps {
  fieldsHeadings: string[];
  fieldData: string[];
  
  data:string[]
}

export interface TabProps {
  tabs: string[];
  initialTab?: string;

}

