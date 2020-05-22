import random
import math
from io import StringIO
import numpy as np

def dist_matrix(bs): 
#функция, которая возвращает матрицу расстояний, на вход подается txt-файл
    with open(file, "r") as ins:
        array = []
        for line in ins:
            array.append(line)
        array.pop(0)
    s = "".join(array)
    c = StringIO(s)
    dists = np.loadtxt(c)
    return dists


class TCNN:
#Transiently Chaotic Neural Network
#TCNN - временно-хаотическая нейронка
    def __init__(self, dists, **constants):
        m,n = dists.shape
        if m != n:
            raise RuntimeError("Distance matrix is not square")
        self.real_dists = dists
        self.norm_dists = dists / dists.max()
        self.n = n
        ns = range(n)
        self.ns = ns
        self.W1 = constants["W1"]
        self.W2 = constants["W2"]
        self.alpha = constants["alpha"]
        self.beta = constants["beta"]
        self.eps = constants["eps"]
        self.k = constants["k"]
        self.z0 = constants["z0"]
        self.I0 = constants["I0"]
        self.z = self.z0        
        self.X = np.zeros((n,n))
        self.Y = np.zeros((n,n))
        self.X += np.random.uniform(-1, 1, (n,n))
        self.pairs = self.__random_pairs()
        self.iter = 0

    def __random_pairs(self):
        pairs = []
        for i in self.ns:
            for j in self.ns:
                pairs.append((i,j))    
        np.random.shuffle(pairs)
        return pairs
            
    def __g(self,x):
        return 0.5 * (1 + math.tanh(x/self.eps))

    def __retrieve(self, attr):
        res = getattr(self,attr)
        if callable(res):
            return res()
        else:
            return res
        
    def run(self, maxiter=None, collecting=None):
        results = {"steps":[]}
        if collecting:
            for attr in collecting:
                results[attr] = []
        iters = 0
        while not self.valid_tour() and (iters < maxiter if maxiter else True):
            self.step()
            if collecting:
                for attr in collecting:
                    results[attr].append(self.__retrieve(attr))
            iters += 1
        return results
    
    def step(self):
        for i,k in self.pairs:
            self.__update_neuron(i,k)
        self.z *= (1 - self.beta)
        self.iter += 1

    def __update_output(self,i,k):
        self.Y[i,k] = self.__g(self.X[i,k])
        
    def __update_neuron(self,i,k):
        n, X, Y = self.n, self.X, self.Y
        W1, W2, alpha = self.W1, self.W2, self.alpha
        ns, ds = self.ns, self.norm_dists
        a = -W1*(sum(Y[i,l] if l != k else 0.0 for l in ns) + sum(Y[j,k] if j != i else 0.0 for j in ns))
        b = -W2*sum(ds[i,j]*(Y[j,(k+1)%n] + Y[j,(k-1)%n]) if j != i else 0.0 for j in ns)
        c = self.k*X[i,k] - self.z*(Y[i, k] - self.I0)
        X[i,k] = alpha*(a + b + W1) + c
        self.__update_output(i,k)
        
    def energy(self):
        W1, W2, Y = self.W1, self.W2, self.Y
        n, ns, ds = self.n, self.ns, self.norm_dists
        temp1 = sum((sum(Y[i,k] for k in ns) - 1.0)*(sum(Y[i,k] for k in ns) - 1.0) for i in ns)
        temp2 = sum((sum(Y[i,k] for i in ns) - 1.0)*(sum(Y[i,k] for i in ns) - 1.0) for k in ns)
        temp3 = 0.0
        for i in ns:
            for j in ns:
                for k in ns:
                    temp3 += ds[i,j]*Y[i,k]*(Y[j,(k+1)%n] + Y[j,(k-1)%n])    
        E1 = 0.5*W1*(temp1 + temp2)
        E2 = 0.5*W2*temp3
        return E1 + E2
        
    def valid_rows(self):
        return [ len(np.where(self.Y[i])[0]) == 1 for i in self.ns ]
    
    def valid_cols(self):
        YT = self.Y.transpose()
        return [ len(np.where(YT[i])[0]) == 1 for i in self.ns ]
        
    def n_valid_rows(self):
        return len(np.where(self.valid_rows())[0])
        
    def n_valid_cols(self):
        return len(np.where(self.valid_cols())[0])
    
    def percent_valid(self):
        total = self.n_valid_rows() + self.n_valid_cols()
        return total / (2.0 * self.n)

    def valid_tour(self):
        return self.percent_valid() == 1
    
    def tour(self):
        if not self.valid_tour:
            raise RuntimeError("Tour is not valid!")
        ns, YT = self.ns, self.Y.transpose()
        return [ np.where(YT[i])[0][0] for i in ns ]
        
    def tour_length(self):
        n, ns, ds = self.n, self.ns, self.real_dists
        tour = self.tour()
        citypairs = [(tour[i], tour[(i+1)%n]) for i in ns ]
        dists = [ ds[cp[0],cp[1]] for cp in citypairs ]
        return sum(dists)
    
    
#вот эти параметры можно менять как захочется, и чекать че будет
#(последний раз я запускал с теми что стоят, и вроде робило)
#там где false там для графиков параметры, пока плохо работают, не рекомендую тру ставить
#print('enter N_RUNS')
N_RUNS = 4                   #кол-во, которые я ее запускаю для получения лучшего результата
#print('enter MAX_IT')
MAX_IT = 1100                  #кол-во итераций поиска минимума
file = 'root/input'
constants = {
    "k": 0.9,                #фактор демпфирования (ставить от 0 до 1)
    "eps": 0.004,            #steepness выходной функции
    "I0": 0.5,               #входное смещение 
    "z0": 0.065,               #начальное значение веса sc
    "W1": 1,                 #веса
    "W2": 1,                 #еще веса, но другие
    "alpha": 0.015,          #параметр масштабирования
    "beta": 0.01,            #фактор демпфирования sc (ставить от 0 до 1)
}
    
def tour_length(tour, dists): #функция которая выдает маршрут и расстояние
    ds = dists
    m,n = dists.shape
    if m != n:
        raise ValueError("The distance matrix is not square")
    if len(tour) != n:
        raise ValueError("The tour length does not match the distance matrix size")
    ns = range(n)
    citypairs = [(tour[i], tour[(i+1)%n]) for i in ns ]
    dists = [ ds[cp[0],cp[1]] for cp in citypairs ]
    return sum(dists)

dists = dist_matrix(file)
tour_lengths = []
best_tour = None
for i in range(N_RUNS):
    net = TCNN(dists, **constants)
    results = net.run(maxiter = MAX_IT, collecting = ["iter"])
    I = results["iter"]
    if net.valid_tour():
        l = net.tour_length()
        tour_lengths.append(l)
        if best_tour is None:
            best_tour = l
        else:
            if l < best_tour:
                best_tour = l

ff = open('root/output', 'w')
ff.write("best tour has length = %f" % (best_tour))
ff.close()
#print("best tour has length = %f" % (best_tour))
