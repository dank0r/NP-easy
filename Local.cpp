
#include<vector>
#include <iostream>
#include <fstream>

using namespace std;
const int N=100;
int matrix [N][N];
int arr_res [N +1];
int arr_per [N +1];
int res = 100000000;


void swap(int *a, int i, int j)
{
  int s = a[i];
  a[i] = a[j];
  a[j] = s;
}
bool NextSet(int *a, int n)
{
  int j = n - 2;
  while (j != -1 && a[j] >= a[j + 1]) j--;
  if (j == -1)
    return false; 
  int k = n - 1;
  while (a[j] >= a[k]) k--;
  swap(a, j, k);
  int l = j + 1, r = n - 1; 
  while (l<r)
    swap(a, l++, r--);
  return true;
}

void Print(int *a, int n) 
  static int num = 1; 
  //cout.width(3); /
  cout << num++ << ": ";
  for (int i = 0; i < n; i++)
    cout << a[i] << " ";
  cout << endl;
}

int calc(int *a, int n){
    int sum=0;
    for (int i = 0; i<n-1; i++){
       sum+= matrix[a[i]][a[i+1]];


      // cout<<"''"<<matrix[a[i]][a[i+1]]<<" "<<a[i]<<" "<<a[i+1]<<" "<< i;

    }
   // cout<<endl;
        sum+=matrix[a[n-1]][a[0]];//+matrix[1][a[n-1]];
    if(sum < res){
        res = sum;

        for (int i=0; i<n ; i++){
            arr_res[i] = a[i];
        }
        //arr_res[n] = 1;

    }
    return sum;
}
int print_res(int n){
	ofstream fout("/root/output");
fout<<res<<endl;

for(int i = 0; i < n; i++ ){
    fout << arr_res[i] <<" ";

}

fout<<arr_res[0]<<endl;
return 1;
}
/*
int rec (){
for

return
}*/

int main()
{
    ifstream fin("/root/input.txt");
   

int n, *a;

    fin>>n;
    for (int i = 1; i <= n ; i++){
        for( int j = 1; j <= n ;j++){
            fin >> matrix[i][j];

        }



    }



  a = new int[n];
  for (int i = 0; i < n; i++)
    a[i] = i + 1;
int  fl = 12354;
int ask=0;
 // Print(a, n);
  do{
    calc(a, n);
//    ask++;
//	if (ask>fl) break;
   // Print(a, n);
 // fin.get(); fin.get();
  }while (NextSet(a, n));


//Print(a, n);

 print_res(n);




    return 0;
}
