import { DocumentData, Firestore, getFirestore } from "firebase-admin/firestore";
import { User } from "../Model/User";
import { conn } from "../../Data Access/DAO/conn";
import { Post } from "../Model/Post";

export class PostRepository {
    private db: Firestore
    private collectionPath: string
    constructor(){
        conn()
        this.db = getFirestore()
        this.collectionPath = 'posts'
    }
    async findUser(id: string): Promise<User | null> {
        const field = 'id';
        const value = id;

        try {
            const collectionRef = this.db.collection('users');
            const query = collectionRef.where(field, "==", value);
            const querySnapshot = await query.get();
            
            if (querySnapshot.empty) {
                console.log("No documents found");
                return null;
            } else {
                let user: User | null = null;

                querySnapshot.forEach(async (doc) => {
                    console.log(doc.id, "=>", doc.data());
                    user = await doc.data() as User;
                });

                return user;
            }
        } catch (error) {
            console.error(`Error finding user by email: ${error}`);
            return null;
        }
    }
    async getAllPosts(): Promise<User[] | null>{
        try {
            const collectionRef = this.db.collection(this.collectionPath);
            const querySnapshot = await collectionRef.get();
            const users: User[] = [];
            querySnapshot.forEach((doc) => {
                const userData = doc.data() as User;
                users.push(userData);
            });
            if(users[1] === null){
                console.log('Nenhum post encontrado')
                return null
            }
            return users;
        } catch (error) {
            console.error(`Error fetching users: ${error}`);
            return null;
        }
    }
    
    
    async save(post: Post): Promise<void> {
        try {
            const docRef: DocumentData = await this.db.collection(this.collectionPath).add(post);
            console.log('Usuário cadastrado com sucesso');
            console.log(post)
        } catch (error) {
            console.error(`Erro ao cadastrar o usuário: ${error}`);
        }
    }
}
