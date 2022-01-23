export interface Articles {
    id: string;
    title: string;
    body: string;
    image: string;
    createrid: string;
    creatername:string;
    like:[String];
    isActive: boolean
    createdAt: Date;
}
