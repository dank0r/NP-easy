#include <iostream>
#include <vector>
#include <cmath>
#include <iomanip>   
#include <fstream>
using namespace std;
const int N=1000;

double matrix [N][N]{};
int main(){
	ifstream cin("make_test.txt");
	ofstream cout("input.txt");
	int n;
	cin>>n;
	vector<pair <double, double> > a(n);
	
	for (int i=0; i<n; i++){
		cin>>a[i].first>>a[i].second;
	}
	for (int i=0;i< n;i++){
		for (int j=0; j <n;j++){
			if(i!=j){
				matrix[i][j] = sqrt((a[i].first-a[j].first)*(a[i].first-a[j].first)+(a[i].second-a[j].second)*(a[i].second-a[j].second));
				
			}
			
		}
		
	}
	cout<<n<<endl;
	for(int i=0; i<n;i++){
		for(int j=0; j<n; j++){
			cout<<setprecision(2)<<matrix[i][j]<<" ";
		}
		cout<<endl;
	}
	
	
	
	return 0;
}
