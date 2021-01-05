
export class ConfirmDialogSettings{
    itemConfirming: string; //Display string
    actionConfirming: string; //Display string example: 'delete', 'leave this page' 
    uuid: string = null //uuid value for function if needed
    functionOnConfirm: any // Pass in the function that is used to upload the specified file type        
}